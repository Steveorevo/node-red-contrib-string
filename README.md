# node-red-contrib-string
Provides a node with native and extended chainable JavaScript string parsing
and manipulation methods. The node is a high level wrapper for the concise and
lightweight [stringjs.com](http://stringjs.com) object and uses Node-RED's editor UI to create easy
chaining. Additional string parsing functionality and compatibility have been
added from [fork](https://github.com/Steveorevo/string.js).


## Examples

#### Data Extraction - Get Technical FAX
Methods can be chained within the UI enabling complex and versatile parsing
functionality. Here we can see how easy it is to extract the technical FAX phone
number WhoIS information:

![Node-RED Example](/string/demo/parsed-whois.png?raw=true "Parse WhoIS for Technical FAX")

Consider the given WhoIS dump from a command line console (see image below).
We will want to obtain the FAX number (outlined in the dashed yellow). The string
node will extract the technical FAX phone number by first removing the header,
followed by all data up to the phrase "Technical:". This ensures that we don't
accidentally obtain a FAX number from another section. Lastly, the string node
grabs the number from between the markers "Fax:" and a carriage return and
displays the output in the Node-RED debug window.

![WhoIS Commandline Dump](/string/demo/technical-fax.png?raw=true "Raw Commandline Dump from WhoIS")

The extraction is performed using JavaScript's unique ability to chain actions on
a given object such as the native String object or the popular jQuery component.
This unique contribution to Node-RED furnishes a lightweight and enhanced version
of string parsing functions. The visual representation in the first image could be
coded by hand in JavaScript (after including all the dependencies) as:
```
console.log(
  msg.payload.getRightMost('%')
             .delLeftMost('Technical:')
             .between('FAX:', '\n')
);
```

#### Validate Phone Number
Furthermore, a single string node could have the properties set to perform data
validation. In this simple example we'll perform some conditional checks to
see if the phone number is numeric and furnish a friendly error message if it is
not. Consider the following flow:

![Validate Phone Number](/string/demo/validate-phone.png?raw=true "Validate Phone Number")

Let's take a look at the string node titled "Verify Number" (see image below).
The properties for the node have been configured to use the methods
`stripPunctuation` and `isNumeric` which will result in a boolean true or false.
Next, we convert the boolean to a string using `toString`. Lastly, we use the
`replaceAll` methods to convert the only two boolean possibilities to the
original number as found in property msg.payload or the informative error message
 _"Error! Not a valid number."_.

![Verify Number Node](/string/demo/validate-node-properties.png?raw=true "Verify Number properties")


## Installation
Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-string

The string node will appear in the palette under the function group.
