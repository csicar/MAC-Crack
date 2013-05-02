MAC crack
=========

# Installation

* Install `nodejs` from http://nodejs.org/download/
* download the Ripo as Zip or what ever (and extract it)

# Usage

use `[sudo] node main.js [interface]` to start the script.
This operation will need super user rights.
If the interface is not specified an awful function will try to guess a working interface, so at the moment it's better to specifie the interface.

# **How** it is working

### 1. `sudo fing` 
The script starts with scanning the network with `fing`. Fing's output will be saved in `nodes.csv` as a comma seperated file. The file contains all MAC-Addresses in the network.

### 2. `ifconfig hw ether [mac]`
Now your MAC-Address gets changed to the one's in the `nodes.csv` file.

### 3. `curl google.com`
Now the script tests Internet-connectivity. `curl` gets `google.com`.
`curl` will return an empty string, if it get's redirected etc, so I can be sure, that access is properly working.

# **Why** it is working

Networks handle authentification over your MAC-Address (because it's the only thing that can('t) change). 
If other devices on the network have rights for internet access, you can use their MAC-Addresses (and Identity) to get Access too.
