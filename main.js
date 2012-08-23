var fs = require("fs"),
	exec = require("child_process").exec,
	platform = process.platform,
	interface = process.argv[2];

function interfaceChecker(callback){
	if(interface == undefined){
		log("auto detecting interface...")
		var interfaces = ["wlan0", "eth0", "en0", "wlan1", "en1"];
		exec("ifconfig", function(err, stdout, stderr){
			var i = 0;
			function next(){
				if(stdout.match(interfaces[i])){
					interface = interfaces[i];
					callback()
				}else if(i == interfaces.length){
					log("auto-detection failed.", "error");
				}else{
					i += 1;
					next()
				}
			};
			next();		
		})
	}
}

function log(text, type){
	var io = {
		log: function(){
			console.log("*    "+text);
		},
		error: function(){
			console.log("!!   "+text);
		}
	};
	if(io[type] == undefined){type = "log"};
	io[type]();
}

var commands = {
	changeMAC: {
		linux: "ifconfig {{interface}} down;"+
			   "ifconfig {{interface}} hw ether {{MAC}};"+
			   "ifconfig {{interface}} up;",
		darwin: "ifconfig {{interface}} ether {{MAC}}"
	}	
}
function command(name, vars){
	var s = commands[name][platform]
	for(i in vars){
		s = s.replace("{{"+i+"}}", vars[i])
	}
	return s;
}
function getNodes(callback){
	console.log("*    getting all network nodes...")
	exec("fing -r 1 -o table,csv,nodes.csv", function(err, stdout, stderr){
		if(err || stderr){
			console.log("!!   error at execution:");
			if(err) console.log(err);
			if(stderr) console.log(stderr);
		}else{
			var NumOfNodes = /has ([1-9]*)/g.exec(stdout).index;
			console.log("*    "+NumOfNodes+" are up");
			console.log("*    reading output file")
			fs.readFile("nodes.csv", "utf8", function(err, data){
				if(err) {
					console.log("!!   error at opening nodes.csv:"+err);
				}else{
					console.log("*    parsing output")
					data = data.split("\n");
					var output = []
					for(var i = 0; i < data.length; i++){
						data[i] = data[i].split(";");
						output.push(data[i][5])
						if(i+1 == data.length){
							callback(output);
						}
					}
				}
			})
		}
	});
};
function tryMacs(macs){
	var i = 0;
	function next(mac){
		console.log("*    changing MAC-Address...")
		exec(command("changeMAC", {interface: interface, MAC: mac}), function(err, stdout, stderr){
			console.log("*    waiting for connect...")
			setTimeout(function(){
				console.log("*    getting google.com...")
				exec("curl google.com", function(err, stdout, stderr){
					if(stdout){
						console.log("*    ,-)")
						console.log("*    it's working !!!!");
						console.log("*    using "+mac);
					}else{
						console.log("*    :-(")
						console.log("*    address not working\n*    trying next one")
						next(macs[++i]);
					}
				})
			}, 10000)
		})
	}
	next(macs[i])
}
(function(){
	if(process.env.SUDO_USER || process.env.USER === "root"){
		interfaceChecker(function(){
			getNodes(tryMacs);
		});
	}else{
		console.log("*   you need to be root to exec this. \n*   Try sudo [the command]")
	}
})()