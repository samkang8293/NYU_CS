
/***********************************************************
  This file contains the code for the L2 cache. It is a 
  2MB direct-mapped, write-back cache. Only the lowest 
  48 bits of an address are actually used and the top 16 
  bits of an address is ignored.

  Since a word is 64 bits (8 bytes) and a cache line is 8 words, 
  there are a total of 64 bytes (which is 2^6 bytes) in a cache
  line. Thus, the lowest 6 bits (i.e. log 64) of an address are used to 
  specify the byte offset within the cache line.

  Since the total amount of data in the L2 cache is 2MB 
  (i.e. 2^21 bytes) and there are 64 bytes (i.e. 2^6 bytes)
  per cache line, the number of cache lines is:

     (2^21 bytes)/(2^6 bytes/cache line) = 2^15 cache lines

  Therefore, the index within an address used to select the cache 
  line is 15 bits (i.e. log 2^15).
   
  Since the offset is the lowest 6 bits and the index is the next
  lowest 15 bits of the 48 bits of an address that are actually
  used, the tag bits are the remaining 48-(15+6) = 27 bits.
   
   So, the 64-bit address is decomposed as follows:

      16         27          15           6
  -------------------------------------------
 |  unused  |   tag    |    index   | offset |
  -------------------------------------------


   Each L2 cache entry is structured as follows:

    1 1    3        27            
   ------------------------------------------------
   |v|d|reserved|  tag  |  8-word cache line data  |
   ------------------------------------------------

  where "v" is the valid bit and "d" is the dirty bit.
  The 3-bit "reserved" field is an artifact of using
  C -- it wouldn't be in the actual cache hardware.

************************************************************/

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include "memory_subsystem_constants.h"
#include "l2_cache.h"


//number of cache entries (2^15)
#define L2_NUM_CACHE_ENTRIES (1<<15)

/***************************************************
This struct defines the structure of a single cache
entry in the L2 cache. It has the following fields:
  v_d_tag: a 32-bit unsigned int (uint32_t) containing 
           the valid (v) bit at bit 31 (leftmost bit),
           the dirty bit (d) at bit 30, and the tag 
           in bits 0 through 26 (the 27 rightmost bits)
  cache_line: an array of 8 words, constituting a single
              cache line.
****************************************************/
typedef struct {
  uint32_t v_d_tag;
  uint64_t cache_line[WORDS_PER_CACHE_LINE];
} L2_CACHE_ENTRY;


// Although addresses are 64 bits, only the lowest 48
// bits are actually used. The upper 16 bits are
// zeroed out, using this mask.

#define LOWER_48_BIT_MASK 0xFFFFFFFFFFFF

//the valid bit is bit 31 (leftmost bit) of v_d_tag word
//The mask is 1 shifted left by 31

#define L2_VBIT_MASK (0x1 << 31)

//dirty bit is bit 30 (second to leftmost bit) of v_d_tag word
//The mask is 1 shifted left by 30

#define L2_DIRTYBIT_MASK (0x1 << 30)

//tag is lowest 27 bits of v_d_tag word, so the mask is 0x7FFFFFF

#define L2_ENTRY_TAG_MASK 0x7FFFFFF


//The L2 cache is just an array of cache entries
L2_CACHE_ENTRY l2_cache[L2_NUM_CACHE_ENTRIES];

// Note that since l2_cache is an array of L2_CACHE_ENTRY structs,
// not an array of pointers, you would NOT use "->" to access the
// a field of an entry. For example, you would write
// l2_cache[i].v_d_tag, but NOT l2_cache[i]->v_d_tag.


/************************************************
            l2_initialize()

This procedure initializes the L2 cache by clearing
the valid bit of each cache entry.
************************************************/

void l2_initialize()
{
  // Just need to zero out the valid bit in each cache entry. 
  // However, there's no reason not to write a 0 to the entire
  // v_d_tag field, since it's actually more efficient.

  for (int i=0; i < L2_NUM_CACHE_ENTRIES; i++) {
    l2_cache[i].v_d_tag = ((l2_cache[i].v_d_tag) & (0));
  }
}


// Bits 21-47 of an address are used as the tag bits.
// So the mask is 27 ones (so 7FFFFFF hex) shifted left by 21 bits.

#define L2_ADDRESS_TAG_MASK ((uint64_t) 0x7ffffff << 21)
#define L2_ADDRESS_TAG_SHIFT 21

//Bits 6-20 (so 15 bits in total) of an address specifies the index of the
//cache line within the L2 cache.
//The value of the mask is 15 ones (so 7FFF hex) shifted left by 6 bits

#define L2_INDEX_MASK (0x7fff << 6)
#define L2_INDEX_SHIFT 6

#define L2_HIT_STATUS_MASK 0x1

/****************************************************

          l2_cache_access()
          
This procedure implements the reading and writing of cache lines from
and to the L2 cache. The parameters are:

address:  unsigned 64-bit address. This address can be anywhere within
          a cache line. Only the lower 48 bits of the address are actually
          used.

write_data:  an array of unsigned 64-bit words. On a write operation,
             if there is a cache hit, 8 words are copied from write_data 
             to the appropriate cache line in the L2 cache.

control:  an unsigned byte (8 bits), of which only the two lowest bits
          are meaningful, as follows:
          -- bit 0:  read enable (1 means read, 0 means don't read)
          -- bit 1:  write enable (1 means write, 0 means don't write)

read_data: an array of unsigned 64-bit words. On a read operation,
           if there is a cache hit, 8 words are copied from the 
           appropriate cache line in the L2 cache to read_data.

status: this in an 8-bit output parameter (thus, a pointer to it is 
        passed in).  The lowest bit of this byte should be set to 
        indicate whether a cache hit occurred or not:
              cache hit: bit 0 of status = 1
              cache miss: bit 0 of status = 0
        Since a pointer is being passed in, the pointer
        must be dereferenced to set the bit: *status = ...

If the access results in a cache miss, then the only
effect is to set the lowest bit of the status byte to 0.

**************************************************/

void l2_cache_access(uint64_t address, uint64_t write_data[], 
		     uint8_t control, uint64_t read_data[], uint8_t *status)
{

  // Only the lower 48 bits of the address are used.

  address = address & LOWER_48_BIT_MASK;
  
  //Extract from the address the index of the cache entry in the cache.
  //Use the L2_INDEX_MASK mask to mask out the appropriate
  //bits of the address and L2_INDEX_SHIFT
  //to shift the appropriate amount.

  uint64_t cache_index = ((address & L2_INDEX_MASK) >> (L2_INDEX_SHIFT));

  //Extract from the address the tag bits.
  //Use the L2_ADDRESS_TAG_MASK mask to mask out the appropriate
  //bits of the address and L2_ADDRESS_TAG_SHIFT
  //to shift the appropriate amount.

  uint64_t tag_bits = ((address & L2_ADDRESS_TAG_MASK) >> L2_ADDRESS_TAG_SHIFT);

  //if the selected cache entry has a zero valid bit or 
  //if the entry's tag does not match the tag bits of
  //the address, then it is a cache miss. Set the
  //low bit of the status byte appropriately.

  if ((!((l2_cache[cache_index].v_d_tag) & (L2_VBIT_MASK))) || (((l2_cache[cache_index].v_d_tag) & (L2_ENTRY_TAG_MASK)) != (tag_bits))) {
    *status = 0; 
  }

  //Otherwise, it's a cache hit. 
  //If the read-enable bit of the control parameter is set then copy
  //the cache line data in the cache entry into read_data.
  //If the write-enable bit of the control parameter is set then copy
  //write_data into the cache line data of the cache entry and
  //set the dirty bit.
  //Set the low bit of the status byte appropriately.

  else {
    if (control & READ_ENABLE_MASK) {
      for (int i=0; i < WORDS_PER_CACHE_LINE; i++) { 
        uint64_t copied_data_r = l2_cache[cache_index].cache_line[i];
        read_data[i] = copied_data_r;
      }
    }
    
    if (control & WRITE_ENABLE_MASK) {
      for (int i=0; i < WORDS_PER_CACHE_LINE; i++) {
        uint64_t copied_data_w = write_data[i];
        l2_cache[cache_index].cache_line[i] = copied_data_w;
      }
      
      l2_cache[cache_index].v_d_tag = (l2_cache[cache_index].v_d_tag | L2_DIRTYBIT_MASK); 
    }

    *status = (*status | L2_HIT_STATUS_MASK);
  }
}

/********************************************************

             l2_insert_line()

This procedure inserts a new cache line into the L2 cache.

The parameters are:

address: 64-bit memory address for the new cache line.

write_data: an array of unsigned 64-bit words containing the 
            cache line data to be inserted into the cache.

evicted_writeback_address: a 64-bit output parameter (thus,
          a pointer to it is passed) that, if the cache line
          being evicted needs to be written back to memory,
          should be assigned the memory address for the evicted
          cache line. Since it is a pointer, writing the
          memory address for the evicted line requires a 
          pointer dereference:  *evicted_writeback_address = ...
          
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
        To write the status bit, a pointer dereference is 
        needed:  *status = ...

*********************************************************/

void l2_insert_line(uint64_t address, uint64_t write_data[], 
		    uint64_t *evicted_writeback_address, 
		    uint64_t evicted_writeback_data[], 
		    uint8_t *status)
{

  // Only the lower 48 bits of the address are used.

  address = address & LOWER_48_BIT_MASK;
  
  //Extract from the address the index of the cache entry in the cache.
  //See l2_cache_access, above.

  uint64_t index = ((address & L2_INDEX_MASK) >> L2_INDEX_SHIFT);

  //Extract from the address the tag bits.
  //See l2_cache_access, above.

  uint64_t address_tag = ((address & L2_ADDRESS_TAG_MASK) >> L2_ADDRESS_TAG_SHIFT);
  
  uint64_t entry_tag = l2_cache[index].v_d_tag & L2_ENTRY_TAG_MASK;

  uint64_t word_offset;

  //If the cache entry has a zero valid bit or a zero dirty bit, 
  //then the entry can simply be overwritten with the new line. 
  //Copy the data from write_data to the cache line in the entry, 
  //set the valid bit of the entry, clear the dirty bit of the 
  //entry, and write the tag bits of the address into the tag of 
  //the entry. Clear the low bit of the status byte 
  //to indicate that no write-back is needed. Nothing further
  //needs to be done in this cae.

  if ((!(l2_cache[index].v_d_tag & L2_VBIT_MASK)) || (!(l2_cache[index].v_d_tag & L2_DIRTYBIT_MASK))) {
    for (int i=0; i<WORDS_PER_CACHE_LINE; i++) {
      uint64_t copied_data_w = write_data[i];
      l2_cache[index].cache_line[i] = copied_data_w;
    }

    l2_cache[index].v_d_tag = (l2_cache[index].v_d_tag | L2_VBIT_MASK);
    l2_cache[index].v_d_tag = (l2_cache[index].v_d_tag) & (~(L2_DIRTYBIT_MASK));
    l2_cache[index].v_d_tag = (l2_cache[index].v_d_tag & (~(L2_ENTRY_TAG_MASK)) | (address_tag));
    
    *status = 0;
  }
  
  //Otherwise, the current entry has to be written back before the
  //being overwritten by the new cache line. 

  //The address to write the current entry back to is constructed from the
  //entry's tag and the index in the cache by:
  // (evicted_entry_tag << L2_ADDRESS_TAG_SHIFT) | (index << L2_INDEX_SHIFT)
  //This address should be written to the evicted_writeback_address output
  //parameter (don't forget the pointer dereference).
  //The cache line data in the current entry should be copied to the
  //evicted_writeback_data_array.
  //The low bit of the status byte should be set to 1 to indicate that
  //the write-back is needed.

  else {
    uint64_t evicted_entry_tag = entry_tag;
    *evicted_writeback_address = ((evicted_entry_tag << L2_ADDRESS_TAG_SHIFT) | (index << L2_INDEX_SHIFT));

    for (int i=0; i < WORDS_PER_CACHE_LINE; i++) {
      evicted_writeback_data[i] = l2_cache[index].cache_line[i];
    }
    *status = (*status | L2_HIT_STATUS_MASK);
  }

  //Then, copy the data from write_data to the cache line in the entry, 
  //set the valid bit of the entry, clear the dirty bit of the 
  //entry, and write the tag bits of the address into the tag of 
  //the entry.

  for (int i=0; i < WORDS_PER_CACHE_LINE; i++) {
    uint64_t copied_value_w = write_data[i];
    l2_cache[index].cache_line[i] = copied_value_w;
  }

  l2_cache[index].v_d_tag = (l2_cache[index].v_d_tag | L2_VBIT_MASK);
  l2_cache[index].v_d_tag = (l2_cache[index].v_d_tag) & (~(L2_DIRTYBIT_MASK));
  l2_cache[index].v_d_tag = ((l2_cache[index].v_d_tag & (~(L2_ENTRY_TAG_MASK))) | (address_tag));
}
  
