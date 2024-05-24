# Promise

an object
* reps an async task
* (writing to a db, reading from a file, reading from network)
* has state
    * pending: not done with task yet
    * fulfilled: task finished, success!
    * rejected: task finished, failed
* u can call
    * then ---> set what to do when task finishes (by supplying function)
    * then will return another promise (same promise returned by supplied fulfill function)
    