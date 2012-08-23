MAC crack
=========

# Usage

use `[sudo] node main.js [interface]` to start the script.
This operation will need super user rights.
If the interface is not specified an awful function will try to guess a working interface, so at the moment it's better to specifie the interface.

# How it is working

best discription is pseudo bash:
```bash
sudo fing;
#for each found MAC Address:
	ifconfig [interface] down;
	ifconfig [interface] hw ether [MAC Address];
	ifconfig [interface] up;
	curl google.com = $out;
	if[[$out != ""]]then;
		#,-)
	else
		#:-(

```