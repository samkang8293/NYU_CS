#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "node_utils.h"

#define BOOL int
#define TRUE 1
#define FALSE 0

NODE *root = NULL;

// Returns true if user types "yes" or "y" (upper or lower case)
// and returns false if user types "no" or "n". Keeps
// prompting otherwise.

BOOL yes_response()
{
  char reply[10];

  while (1) { //if user types yes or no (or y or n), then the while loop will end, or else it will keep on prompting to enter yes or no (or y or n)
    scanf("%s", reply);

    if (strcasecmp(reply, "yes") == 0 || strcasecmp(reply, "y") == 0) {
      return TRUE;
    }

    else if (strcasecmp(reply, "no") == 0 || strcasecmp(reply, "n") == 0) {
      return FALSE;
    }

    else {
      printf("Type yes or no: ");
    }
  }
}

// This procedure creates a new NODE and copies
// the contents of string s into the 
// question_or_animal field.  It also initializes
// the left and right fields to NULL.
// It should return a pointer to the new node

NODE *new_node(char *s)
{
  NODE *newnode = (NODE *)malloc(sizeof(NODE));

  strcpy(newnode -> question_or_animal, s);

  newnode -> left = NULL;
  newnode -> right = NULL;

  return newnode;
}

// This is the procedure that performs the guessing.
// If the animal is not correctly guessed, it prompts
// the user for the name of the animal and inserts a
// new node for that animal into the tree.

void guess_animal()
{
  // If the root is NULL, then there are no animals in 
  // the tree. Prompt the player for the name of an 
  // animal, create a node for that animal, and make
  // that node the root of the tree.
  NODE *current_node = root;

  if (root == NULL) { //the base case scenario for guess_animal() where it creates a new root node
    char animal[100];
    printf("Enter the name of an animal: ");
    scanf("%s", animal);
    NODE *animal_node = new_node(animal);

    *root = *animal_node;
  }

    /*
      Otherwise (i.e. if the root is not NULL)
      Then descend down the tree. At each node encountered:

      If the left and right fields of the node are not NULL, i.e. the node
      is an interior node and must contain a question, then:
      - print the question_or_answer field, which will be a yes/no question.
      - read the response from the user
      - If the response is yes, follow the left field to the next node. Otherwise,
        follow the right field.
    */

  if (current_node != NULL) {
    while (current_node->left != NULL && current_node->right != NULL) { //while loop to ensure we are traversing the children nodes
      printf("\n%s\n", current_node -> question_or_animal);

      if (yes_response()) { //if this is true, we traverse the left node
        current_node = current_node->left;
        }
      else { //if false, we traverse the right node
        current_node = current_node->right;
        }
      }
    }
  

  /*
      Otherwise, if the left and right fields are NULL (i.e. the node is a leaf), 
      then the question_or_animal field contains an animal. Print the
      the question_or_animal field as the guess and prompt the user
      if the guess was correct. If the guess was correct, then 
      return. Otherwise, do the following:
           - prompt the user for the name of the new animal she was thinking of
           - prompt the user for a yes or no question distinguishing the new animal from the guessed animal
	   - ask the user what the answer for the new animal would be (yes or no)
           - create a new node with the new animal in the question_or_animal field
	   - create another new node that has the guessed animal in the question_or_animal field
           - make the two new nodes the children of the current node, where the animal for which the
             answer to the question is "yes" is the left child and the other animal is the right child.
           - overwrite the question_or_animal field of the current node with the new question.

      Note that the tree is a stricly binary tree, i.e. left and right fields of each node are either both NULL or 
      both valid pointers to child nodes (in other words, each node is a leaf or has exactly two children).
    */

  if (current_node -> left == NULL && current_node -> right == NULL) {
    printf("\nIs your animal %s? ", current_node->question_or_animal);

    if (yes_response()) {
      printf("Alright, I win!");
      return; //this returns the program back to the do-while loop
    }

    else {
      char actual_animal[100];
      printf("\nI'm lost. What is the animal you were thinking of?: ");
      scanf("%s", actual_animal);
      NODE *new_animal_node = new_node(actual_animal);

      char question[100];
      printf("\nPlease provide a yes or no question that distinguishes %s from %s: ", actual_animal, current_node -> question_or_animal);
      fgets(question, sizeof(question), stdin); //gets the entire line of the string instead of stopping at whitespace like scanf does
      NODE *copied_current_node = new_node(current_node -> question_or_animal);

      if (read_line(question)) { //this makes sure the question variable is filled and doesn't skip over to the question inside the if statement
        printf("\nWhat is the answer for %s (yes or no): ", actual_animal);
      }

      if (yes_response()) {
        current_node -> left = new_animal_node;
        current_node -> right = copied_current_node;
      }
      else {
        current_node -> left = copied_current_node;
        current_node -> right = new_animal_node;
      }
      strcpy(current_node -> question_or_animal, question);
      return; // this returns the program back to the do-while loop
    }
  }
}


//This code is complete. Just add comments where indicated.

int main()
{ int i;
  BOOL done = FALSE;

  //creates a file pointer, which then opens the file "data.dat," reads its contents, and stores them into the pointer variable.
  FILE *datafile = fopen("data.dat", "r"); 

  if (datafile == NULL) {
    printf("data.dat not found\n");
    exit(1);
  }

  //creates a file pointer called backupfile, which opens a file called "data.dat.bak" (or the backup file to data.dat),
  //writes in it, and stores the information into the variable.
  FILE *backupfile = fopen("data.dat.bak", "w");

  //the root is equal to the new tree that exists in the datafile variable (or data.dat file)
  root = read_tree(datafile);

  //call write_tree() to write the initial tree to the
  //backup file (i.e. to backup the tree data)
  write_tree(root,backupfile);

  //close both files (for now)
  fclose(backupfile);
  fclose(datafile);

  printf("Welcome to the animal guessing game (like 20 questions).\n");
  do { 
    printf("\nThink of an animal...\n");
    guess_animal();  //runs the guess_animal method and begins guessing the animal
    printf("\nDo you want to play again? (yes/no) >");
  } while (yes_response());  //The Do-While loop will run the functions within the "do" section such as guess animal while yes_response() is not 0 or FALSE.


  //now open the "data.dat" file for writing
  datafile = fopen("data.dat", "w");

  //This recursively a pre-order traversal of the tree starting at the root
  write_tree(root, datafile);

  //close the data.dat file
  fclose(datafile);
}

