#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include "memory_subsystem_constants.h"
#include "main_memory.h"

//main memory is just a (dynamically allocated) array
//of unsigned 64-bit words.

uint64_t *main_memory;

uint64_t main_memory_size_in_bytes;


/************************************************************************
                 main_memory_initialize
This procedure allocates main memory, according to the size specified in bytes.
The procedure should check to make sure that the size is a multiple of 64 (since
there are 8 bytes per word and 8 words per cache line).
*************************************************************************/

void main_memory_initialize(uint64_t size_in_bytes)
{

  //Check if size in bytes is divisible by 64.
  if (size_in_bytes & 0x3F) { //lowest 6 bits should be 000000
    printf("Error: Memory size (in bytes) must be a multiple of 8-word cache lines (64 bytes)\n");
    exit(1);
  }

  //Allocate the main memory to be the specified size, using malloc

  main_memory_size_in_bytes = size_in_bytes;

  main_memory = (uint64_t *) malloc(size_in_bytes);

  //Write a 0 to each word in main memory. Note that the 
  //size_in_bytes parameter specifies the size of main memory
  //in bytes, but, since main_memory is declared as an
  //array of 64-bit words, it is written to a word at a time
  //(not a byte at a time). Obviously, the size of main memory
  //in words is 1/8 of the size of main memory in bytes.

  for (int i = 0; i <= (main_memory_size_in_bytes/BYTES_PER_WORD); i++) {
    uint64_t word = (uint64_t) 0;
    main_memory[i] = word;
  }

}


// Although addresses are 64 bits, only the lowest 48
// bits are actually used. The upper 16 bits are
// zeroed out. 

#define LOWER_48_BIT_MASK 0xFFFFFFFFFFFF

//zeroing out the lowest 6 bits of an address (i.e. the
//3 byte offset bits and the 3 word offset bits) indicates
//the address of the start of the corresponding cache line 
//in memory. Use this mask to zero out the lowest 6 bits,
//since 3F hex = 000...0111111 binary, and using ~ to flip the bits
//gives 111...11000000 in binary.

#define CACHE_LINE_ADDRESS_MASK ~0x3f


/********************************************************************
               main_memory_access

This procedure implements the reading and writing of cache lines from
and to main memory. The parameters are:

address:  unsigned 64-bit address. This address can be anywhere within
          a cache line.

write_data:  an array of unsigned 64-bit words. On a write operation,
             8 words are copied from write_data to the appropriate cache
             line in memory.

control:  an unsigned byte (8 bits), of which only the two lowest bits
          are meaningful, as follows:
          -- bit 0:  read enable (1 means read, 0 means don't read)
          -- bit 1:  write enable (1 means write, 0 means don't write)

read_data: an array of unsigned 64-bit integers. On a write operation,
           8 64-bit words are copied from the appropriate cache line in 
           memory to read_data.

*********************************************************/

void main_memory_access(uint64_t address, uint64_t write_data[], 
			uint8_t control, uint64_t read_data[])

{


  // Only the lower 48 bits of the address are used.

  address = address & LOWER_48_BIT_MASK;

  //Need to check that the specified address is within the 
  //size of the memory. If not, print an error message and
  //exit from the program by calling "exit(1)", see above.
 
  if (address >= main_memory_size_in_bytes) {
    printf("Error: Address is out of bounds from the memory. Provide an address that is within the memory. \n");
    exit(1);
  }
  
  //Determine the address of the start of the desired cache line.
  //Use CACHE_LINE_ADDRESS_MASK to mask out the appropriate
  //number of low bits of the address. This address is in bytes.

  uint64_t cache_line_start = (uint64_t) ((address) & (CACHE_LINE_ADDRESS_MASK));

  //Since the above address is in bytes, but memory is an array of
  //8-byte words, the address needs to be converted to an index
  //into the memmory array.

  uint64_t index_in_memory = (uint64_t) ((cache_line_start) >> (WORDS_TO_CACHE_LINES_SHIFT));

  //If the read-enable bit of the control parameter is set, then copy
  //the cache line starting at the above index in memory into read_data.
  //See memory_subsystem_constants.h for masks that are convenient for
  //testing the bits of the control parameter.

  if (((control) & (READ_ENABLE_MASK))) {
    for (int i = 0; i < 8; i++) {
      uint64_t copied_value_r = main_memory[i + index_in_memory];
      read_data[i] = copied_value_r;
    }
  }

  //If the write-enable bit of the control parameter is set then copy
  //write_data into the cache line starting at the above index in memory.

 if (((control) & (WRITE_ENABLE_MASK))) {
    for (int i = 0; i < 8; i++) {
      uint64_t copied_value_w = write_data[i];
      main_memory[i + index_in_memory] = copied_value_w;
    }
 }

}
