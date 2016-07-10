/*
 *	Module
 *	Name: proc_helpers
 *	Export: Object
 *	Description: Helper functions related to process
 */

//Get the argument for a process option
exports.arg = function(optionName, optRequired, argOptional) {
	if (process.argv.indexOf(optionName) !== -1) {
		var val = process.argv[process.argv.indexOf(optionName) + 1];
		if (!val && !argOptional) {
			console.error("ERROR - missing required argument for option:",optionName);
			process.exit(1);
		}
		return val;
	} else if (required) {
		console.error("ERROR - missing required option:",optionName);
		process.exit(1);
	}
	return null;
};