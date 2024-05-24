
/************************************************************

The L1 cache is a 64KB, 4-way set associative, write-back cache
for both instructions and data (not separate I-cache and D-cache).
As with the rest of the memory subsystem, a cache line is 8 words,
where each word is 64 bits (8 bytes).

The size of the L1 cache is 64KB of data
                          = 8K words (since there are 8 bytes/word)
                          = 1K cache lines (since there are 8 words/cache line)
                          = 256 sets (since there are 4 cache lines/set)

Each cache entry has: valid bit, reference bit, dirty bit,
                     tag, and cache-line data.

The upper 16 bits of a 64-bit address are ignored, so the 
remaining 48 bits of an address are grouped as follows (from lsb to msb):
3 bits are used for byte offset within a word (bits 0-2)
3 bits are used for word offset within a cache line (bits 3-5)
8 bits are used for the set index, since there are 256 = 2^8 sets per cache (bits 6-13).
34 bits are used for the tag (bits 14-47).

Therefore, a 64-bit address looks like:

     16        34        8         3        3
  ------------------------------------------------
 | unused |   tag   |   set    | word   |  byte  |
 |        |         |  index   | offset | offset |
  ------------------------------------------------

Each cache entry is structured as follows:

    1 1 1    27      34 
    ------------------------------------------------
   |v|r|d|reserved|  tag  |  8-word cache line data |
    ------------------------------------------------

where:
  v is the valid bit
  r is the reference bit
  d is the dirty bit
and the 27 "reserved" bits are an artifact of using C. The
cache hardware would not have those.

**************************************************************/

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include "memory_subsystem_constants.h"
#include "l1_cache.h"


/***************************************************
This struct defines the structure of a single cache
entry in the L1 cache. It has the following fields:
  v_r_d_tag: 64-bit unsigned word containing the 
           valid (v) bit at bit 63 (leftmost bit),
           the reference (r) bit at bit 62,
           the dirty bit (d) at bit 61, and the tag 
           in bits 0 through 33 (the 34 rightmost bits)
  cache_line: an array of 8 words, constituting a single
              cache line.
****************************************************/

typedef struct {
  uint64_t v_r_d_tag;
  uint64_t cache_line[WORDS_PER_CACHE_LINE];
} L1_CACHE_ENTRY;

//4-way set-associative cache, so there are
//4 cache lines per set.
#define L1_LINES_PER_SET 4

/***************************************************
  This structure defines an L1 cache set. Its only
  field, lines, is an array of four cache lines.
***************************************************/

typedef struct {
  L1_CACHE_ENTRY lines[L1_LINES_PER_SET];
} L1_CACHE_SET;

// Although addresses are 64 bits, only the lowest 48
// bits are actually used. The upper 16 bits are
// zeroed out, using this mask.

#define LOWER_48_BIT_MASK 0xFFFFFFFFFFFF

//There are 256 sets in the L1 cache
#define L1_NUM_CACHE_SETS 256

//The L1 cache itself is just an array of 256 cache sets.
L1_CACHE_SET l1_cache[L1_NUM_CACHE_SETS];

//Mask for v bit: Bit 63 of v_r_d_tag
#define L1_VBIT_MASK ((uint64_t) 1 << 63)

//Mask for r bit: Bit 62 of v_r_d_tag
#define L1_RBIT_MASK ((uint64_t) 1 << 62)

//Mask for d bit: Bit 61 of v_r_d_tag
#define L1_DIRTYBIT_MASK ((uint64_t) 1 << 61)

//The tag is the low 34 bits of v_r_d_tag
//The mask is just 34 ones, so 3FFFFFFFF hex

#define L1_ENTRY_TAG_MASK 0x3FFFFFFFF

//Bits 3-5 of an address specifies the offset of the addressed
//word within the cache line
//Mask is 111000 in binary = 0x38

#define WORD_OFFSET_MASK 0x38

//After masking to extract the word offset, it needs
//to be shifted to the right by 3.
#define WORD_OFFSET_SHIFT 3

// Bits 14-47 of an address are used as the 34 tag bits
// The mask is 34 ones (see L1_ENTRY_TAG_MASK, above) shifted
// left by 14 bits.
#define L1_ADDRESS_TAG_MASK ((uint64_t) L1_ENTRY_TAG_MASK << 14)

//After masking to extract the tag from the address, it needs to 
//be shifted right by 14.
#define L1_ADDRESS_TAG_SHIFT 14

//Bits 6-13 are used to extract the set index from an address.
//The mask is 8 ones (so FF hex) shifted left by 6.
#define L1_SET_INDEX_MASK (0xff << 6)

//After masking to extract the set index from an address, it
//needs to be shifted to the right by 6
#define L1_SET_INDEX_SHIFT 6

//This can be used to set or clear the lowest bit of the status
//register to indicate a cache hit or miss.
#define L1_CACHE_HIT_MASK 0x1


/************************************************
            l1_initialize()

This procedure initializes the L1 cache by clearing
the valid bit of each cache entry in each set in
the cache.
************************************************/

void l1_initialize()
{
  //just need to zero out the valid bit in each cach entry.
  //However, there's no reason not to write a 0 to the entire
  //v_r_d_tag field, since it's actually more efficient.

  for (int i=0; i<L1_NUM_CACHE_SETS; i++) {
    for (int j=0; j<L1_LINES_PER_SET; j++) {
      l1_cache[i].lines[j].v_r_d_tag = 0;
    }
  }
}


/**********************************************************

             l1_cache_access()

This procedure implements the reading or writing of a single word
to the L1 cache. 

The parameters are:

address:  unsigned 64-bit address. This address can be anywhere within
          a cache line.

write_data: a 64-bit word. On a write operation, if there is a cache
          hit, write_data is copied to the appropriate word in the
          appropriate cache line.

control:  an unsigned byte (8 bits), of which only the two lowest bits
          are meaningful, as follows:
          -- bit 0:  read enable (1 means read, 0 means don't read)
          -- bit 1:  write enable (1 means write, 0 means don't write)

read_data: a 64-bit ouput parameter (thus, a pointer to it is passed).
         On a read operation, if there is a cache hit, the appropriate
         word of the appropriate cache line in the cache is written
         to read_data.

status: this in an 8-bit output parameter (thus, a pointer to it is 
        passed).  The lowest bit of this byte should be set to 
        indicate whether a cache hit occurred or not:
              cache hit: bit 0 of status = 1
              cache miss: bit 0 of status = 0

If the access results in a cache miss, then the only
effect is to set the lowest bit of the status byte to 0.

**********************************************************/

void l1_cache_access(uint64_t address, uint64_t write_data, 
		     uint8_t control, uint64_t *read_data, uint8_t *status)
{
    // Only the lower 48 bits of the address are used.

  address = address & LOWER_48_BIT_MASK;

  //Extract from the address the index of the cache set in the cache.
  //Use the L1_SET_INDEX_MASK mask to mask out the appropriate
  //bits of the address and L1_SET_INDEX_SHIFT to shift the 
  //bits the appropriate amount.

  uint8_t cache_index = (address & L1_SET_INDEX_MASK) >> L1_SET_INDEX_SHIFT;

  //Extract from the address the tag bits.
  //Use the L1_ADDRESS_TAG_MASK mask to mask out the appropriate
  //bits of the address and L1_ADDRESS_TAG_SHIFT to shift the 
  //bits the appropriate amount.

  uint64_t tag_bits = (address & L1_ADDRESS_TAG_MASK) >> L1_ADDRESS_TAG_SHIFT;

  //Extract from the address the word offset within the cache line.
  //Use the WORD_OFFSET_MASK to mask out the appropriate bits of
  //the address and WORD_OFFSET_SHIFT to shift the bits the 
  //appropriate amount.

  uint8_t word_offset = (address & WORD_OFFSET_MASK) >> WORD_OFFSET_SHIFT;

  //Within the set specified by the set index extracted from the address,
  //look through the cache entries for an entry that (1) has its valid 
  //bit set, AND (2) has a tag that matches the tag extracted from the address.

  //If no such entry exists in the set, then the result is a cache miss.
  //The low bit of the status output parameter should be set to 0. There
  //is nothing further to do in this case.

  //Otherwise, if an entry is found with a set valid bit and a matching tag, 
  //then it is a cache hit. The reference bit of the cache entry should be set
  //and the low bit of status output parameter should be set to 1.

  //If a read operation was specified, the appropriate word (as specified by
  //the word offset extracted from the address) of the entry's 
  //cache line data should be written to read_data.

  //If a write operation was specified, the value of write_data should be
  //written to the appropriate word of the entry's cache line data and 
  //the entry's dirty bit should be set.

  for (int i=0; i<L1_LINES_PER_SET; i++) {
    if ((!(l1_cache[cache_index].lines[i].v_r_d_tag & L1_VBIT_MASK)) || (((l1_cache[cache_index].lines[i].v_r_d_tag) & L1_ENTRY_TAG_MASK) != tag_bits)) {
      *status = 0;
    }
    else {
      l1_cache[cache_index].lines[i].v_r_d_tag = (l1_cache[cache_index].lines[i].v_r_d_tag | L1_RBIT_MASK);
      *status = 1;

      if (control & READ_ENABLE_MASK) {
        uint64_t copied_value_r = l1_cache[cache_index].lines[i].cache_line[word_offset];
        *read_data = copied_value_r;
      }
      if (control & WRITE_ENABLE_MASK) {
        uint64_t copied_value_w = write_data;
        l1_cache[cache_index].lines[i].cache_line[word_offset] = copied_value_w;
        l1_cache[cache_index].lines[i].v_r_d_tag = (l1_cache[cache_index].lines[i].v_r_d_tag | L1_DIRTYBIT_MASK);
      }
      break;
    }
  }

}


// This (all 1's) is used in l1_insert_line(), below, to indicate a value that
// is uninitialized.

#define UNINITIALIZED ~0x0


/************************************************************

                 l1_insert_line()

This procedure inserts a new cache line into the L1 cache.

The parameters are:

address: 64-bit memory address for the new cache line.

write_data: an array of unsigned 64-bit words containing the 
            cache line data to be inserted into the cache.

evicted_writeback_address: a 64-bit output parameter (thus,
          a pointer to it is passed) that, if the cache line
          being evicted needs to be written back to memory,
          should be assigned the memory address for the evicted
          cache line.
          
evicted_writeback_data: an array of 64-bit words that, if the cache 
          line being evicted needs to be written back to memory,
          should be assigned the cache line data for the evicted
          cache line. Since there are 8 words per cache line, the
          actual parameter should be an array of at least 8 words.

status: this in an 8-bit output parameter (thus, a pointer to it is 
        passed).  The lowest bit of this byte should be set to 
        indicate whether the evicted cache line needs to be
        written back to memory or not, as follows:
            0: no write-back required
            1: evicted cache line needs to be written back.


 The cache replacement algorithm uses a simple NRU
 algorithm. A cache entry (among the cache entries in the set) is 
 chosen to be written to in the following order of preference:
    - valid bit = 0
    - reference bit = 0 and dirty bit = 0
    - reference bit = 0 and dirty bit = 1
    - reference bit = 1 and dirty bit = 0
    - reference bit = 1 and dirty bit = 1
*********************************************************/


void l1_insert_line(uint64_t address, uint64_t write_data[], 
		    uint64_t *evicted_writeback_address, 
		    uint64_t evicted_writeback_data[], 
		    uint8_t *status)
{

  
  // Only the lower 48 bits of the address are used.

  address = address & LOWER_48_BIT_MASK;

  //Extract from the address the index of the cache set in the cache.
  //see  l1_cache_access above.

  uint64_t set_index = (address & L1_SET_INDEX_MASK) >> L1_SET_INDEX_SHIFT;
  
  //Extract from the address the tag bits. 
  //see l1_cache_access above.

  uint64_t tag = (address & L1_ADDRESS_TAG_MASK) >> L1_ADDRESS_TAG_SHIFT;

  // The cache replacement algorithm uses a simple NRU
  // algorithm. A cache entry (among the cache entries in the set) is 
  // chosen to be written to in the following order of preference:
  //    - valid bit = 0
  //    - reference bit = 0 and dirty bit = 0
  //    - reference bit = 0 and dirty bit = 1
  //    - reference bit = 1 and dirty bit = 0
  //    - reference bit = 1 and dirty bit = 1
  //  The search loops through the lines in the set. If it 
  //  finds a valid bit = 0, then that entry can be overwritten and
  //  we can exit the loop.
  //  Otherwise, we remember the *first* line we encounter which has r=0 and d=0,
  //  the *first* line that has r=0 and d=1, etc. When we're done looping,
  //  we choose the entry with the highest preference on the above list to evict.

  // This variable is used to store the index within the set 
  // of a cache entry that has its r bit = 0 and its dirty bit = 0.
  // Initialize it to UNINITIALIZED (i.e. all 1's, see above) to indicate an invalid value.

  uint64_t r0_d0_index = UNINITIALIZED;  

  // This variable is used to store the index within the set 
  // of a cache entry that has its r bit = 0 and its dirty bit = 1.

  uint64_t r0_d1_index = UNINITIALIZED;

  // This variable isused to store the index within the set 
  // of a cache entry that has its r bit = 1 and its dirty bit = 0.

  uint64_t r1_d0_index = UNINITIALIZED;

  uint64_t r1_d1_index = UNINITIALIZED;

  //In a loop, iterate though each entry in the set.

  // LOOP STARTS HERE
  for (int i=0; i<L1_LINES_PER_SET; i++) {

  // if the current entry has a zero v bit, then overwrite
  // the cache line in the entry with the data in write_data,
  // set the v bit of the entry, clear the dirty and reference bits, 
  // and write the new tag to the entry. Set the low bit of the status
  // output parameter to 0 to indicate that the evicted line does not need 
  // to be written back. There is nothing further to do, the function can
  // return.

    if (!(l1_cache[set_index].lines[i].v_r_d_tag & L1_VBIT_MASK)) {
      for (int j=0; j<WORDS_PER_CACHE_LINE; j++) { //overwrite the cache line
        uint64_t copied_value = write_data[j];
        l1_cache[set_index].lines[i].cache_line[j] = copied_value;
      }
      l1_cache[set_index].lines[i].v_r_d_tag = (l1_cache[set_index].lines[i].v_r_d_tag | L1_VBIT_MASK);
      l1_cache[set_index].lines[i].v_r_d_tag = ((l1_cache[set_index].lines[i].v_r_d_tag) & (~(L1_DIRTYBIT_MASK)));
      l1_cache[set_index].lines[i].v_r_d_tag = ((l1_cache[set_index].lines[i].v_r_d_tag) & (~(L1_RBIT_MASK)));
      l1_cache[set_index].lines[i].v_r_d_tag = ((l1_cache[set_index].lines[i].v_r_d_tag) & (~(L1_ENTRY_TAG_MASK))) | tag;

      *status = 0;
      return;
    }

  //  Otherwise, we remember the first entry we encounter which has r=0 and d=0,
  //  the first entry that has r=0 and d=1, etc.

    else {
      if (((l1_cache[set_index].lines[i].v_r_d_tag & L1_RBIT_MASK) == 0) && ((l1_cache[set_index].lines[i].v_r_d_tag & L1_DIRTYBIT_MASK)==0) && (r0_d0_index == UNINITIALIZED)) {
        r0_d0_index = i;
      }
      else if (((l1_cache[set_index].lines[i].v_r_d_tag & L1_RBIT_MASK) == 0) && ((l1_cache[set_index].lines[i].v_r_d_tag & L1_DIRTYBIT_MASK) != 0) && (r0_d1_index == UNINITIALIZED)) {
        r0_d1_index = i;
      }
      else if (((l1_cache[set_index].lines[i].v_r_d_tag & L1_RBIT_MASK) != 0) && ((l1_cache[set_index].lines[i].v_r_d_tag & L1_DIRTYBIT_MASK) == 0) && (r1_d0_index == UNINITIALIZED)) {
        r1_d0_index = i;
      }
      else {
        r1_d1_index = i;
      }
    }

  }
  // LOOP ENDS HERE


  // When we're done looping, we choose the entry with the highest preference on the above
  // list to evict.

  uint64_t chosen_index;

  
  if (r0_d0_index != UNINITIALIZED) {
    chosen_index = r0_d0_index;
    }
  else if (r0_d1_index != UNINITIALIZED) {
    chosen_index = r0_d1_index;
  }
  else if (r1_d0_index != UNINITIALIZED) {
    chosen_index = r1_d0_index;
  }
  else {
    chosen_index = r1_d1_index;
  }
  

  //If the dirty bit of the chosen entry is been set, the low bit of the status byte 
  //should be set to 1 to indicate that the write-back is needed. Otherwise,
  //the low bit of the status byte should be set to 0.

  if ((l1_cache[set_index].lines[chosen_index].v_r_d_tag & L1_DIRTYBIT_MASK)) {
    *status = 1;
  }

  else {
    *status = 0;
  }
  
  //if the dirty bit of the cache entry to be evicted is set, then the data in the 
  //cache line needs to be written back. The address to write the current entry 
  //back to is constructed from the entry's tag and the set index in the cache by:
  // (evicted_entry_tag << L1_ADDRESS_TAG_SHIFT) | (set_index << L1_SET_INDEX_SHIFT)
  //This address should be written to the evicted_writeback_address output
  //parameter. The cache line data in the evicted entry should be copied to the
  //evicted_writeback_data_array.

  if (*status == 1) {
    uint64_t evicted_entry_tag = ((l1_cache[set_index].lines[chosen_index].v_r_d_tag) & (L1_ENTRY_TAG_MASK));

    *evicted_writeback_address = (evicted_entry_tag << L1_ADDRESS_TAG_SHIFT) | (set_index << L1_SET_INDEX_SHIFT);

    for (int i=0; i<WORDS_PER_CACHE_LINE; i++) {
      evicted_writeback_data[i] = l1_cache[set_index].lines[chosen_index].cache_line[i];
    }
  }

  //Then, copy the data from write_data to the cache line in the entry, 
  //set the valid bit of the entry, clear the dirty bit and reference bit
  //of the entry, and write the tag bits of the address into the tag of 
  //the entry.

  for (int i=0; i<WORDS_PER_CACHE_LINE; i++) {
    l1_cache[set_index].lines[chosen_index].cache_line[i] = write_data[i];
  }
  l1_cache[set_index].lines[chosen_index].v_r_d_tag = (l1_cache[set_index].lines[chosen_index].v_r_d_tag | L1_VBIT_MASK);
  l1_cache[set_index].lines[chosen_index].v_r_d_tag = (l1_cache[set_index].lines[chosen_index].v_r_d_tag & (~(L1_DIRTYBIT_MASK)));
  l1_cache[set_index].lines[chosen_index].v_r_d_tag = (l1_cache[set_index].lines[chosen_index].v_r_d_tag & (~(L1_RBIT_MASK)));
  l1_cache[set_index].lines[chosen_index].v_r_d_tag = (l1_cache[set_index].lines[chosen_index].v_r_d_tag & (~(L1_ENTRY_TAG_MASK))) | tag;

}

/************************************************

       l1_clear_r_bits()

This procedure clears the r bit of each entry in each set of the L1
cache. It is called periodically to support the the NRU algorithm.

***********************************************/
    
void l1_clear_r_bits()
{
  for (int i=0; i<L1_NUM_CACHE_SETS; i++) {
    for (int j=0; j<L1_LINES_PER_SET; j++) {
      l1_cache[i].lines[j].v_r_d_tag = (l1_cache[i].lines[j].v_r_d_tag & (~(L1_RBIT_MASK)));
    }
  }
}

