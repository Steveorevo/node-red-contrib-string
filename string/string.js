module.exports = function(RED) {
    var S = require('string');
    function string(config) {
        RED.nodes.createNode(this, config);
        this.on('input', function(msg) {
            var globalContext = this.context().global;
            var flowContext = this.context().flow;

            // Decode typeInput value by type/value
            function getTypeInputValue(t, v) {
              var r = '';
              switch(t) {
                case "msg":
                  r = RED.util.getMessageProperty(msg, v);
                  break;
                case "flow":
                  r = flowContext.get(v);
                  break;
                case "global":
                  r = globalContext.get(v);
                  break;
                case "str":
                  try {
                    r = unescape(JSON.parse('"'+v+'"'));;
                  }catch(e){
                    r = v;
                  }
                  break;
                case "num":
                  r = parseFloat(v);
                  break;
                case "json":
                  if (v !== '') {
                    r = JSON.parse(v);
                  }else{
                    r = undefined;
                  }
              }
              return r;
            }

            // We could use eval, but this is the safest way to do things
            function executeFunctionByName(functionName, context, args) {
                var namespaces = functionName.split(".");
                var func = namespaces.pop();
                for(var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            }

            // Apply methods to value
            var value = getTypeInputValue(config.object, config.prop);
            value = S(value);
            if (config.methods) {
              config.methods.forEach(function(m, i) {
                switch(m.name) {
                  case 'append':
                    value = S(value.s + getTypeInputValue(m.params[0].type, m.params[0].value));
                    break;
                  case 'prepend':
                    value = S(getTypeInputValue(m.params[0].type, m.params[0].value) + value.s);
                    break;
                  case 'toString':
                    value = S(value.toString());
                    break;
                  default:
                    var args = [];
                    m.params.forEach(function(p, i) {
                      args.push(getTypeInputValue(p.type, p.value));
                    });
                    value = executeFunctionByName(m.name, value, args);
                }
              });
            }
            if (value.s) {
              value = value.s;
            }

            // // Assign value to given object property
            switch(config.objectout) {
              case "msg":
                RED.util.setMessageProperty(msg, config.propout, value);
                break;
              case "flow":
                flowContext.set(config.propout, value);
                break;
              case "global":
                globalContext.set(config.propout, value);
                break;
            }

            // Pass the original message object along
            this.send(msg);
        });
    }


    function var_dump(arr, level) {
        var dumped_text = "";
        if (!level)
            level = 5;

        //The padding given at the beginning of the line.
        var level_padding = "";
        for (var j = 0; j < level + 1; j++)
            level_padding += "    ";

        if (typeof(arr) === 'object') { //Array/Hashes/Objects
            for (var item in arr) {
                var value = arr[item];

                if (typeof(value) === 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += var_dump(value, level + 1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => " + "(" + typeof(value) + ") \"" + value + "\"\n";
                }
            }
        } else { //Stings/Chars/Numbers etc.
            dumped_text = "(" + typeof(arr) + ") " + arr;
            return dumped_text;
        }
        if (level===0){
            return '(object)' + String.fromCharCode(10) + dumped_text;
        }else{
            return dumped_text;
        }
    }
    RED.nodes.registerType("string", string);
}
