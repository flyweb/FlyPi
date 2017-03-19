#!/usr/bin/expect -f
spawn vncserver
expect "Password: "
send "raspberry\r"
expect "Verify: "
send "raspberry\r"
expect "Would you like to enter a view-only password (y/n)? "
send "n\r"