module.exports = function(grunt) {
    "use strict";

    grunt.registerTask("banner", "Log something to stdout", function(message,font) {
        var _message=message||'default message';
        var _font=font||'3-d';
        grunt.config("asciify.banner.text", _message);
        grunt.config("asciify.banner.options.log", "true");
        grunt.config("asciify.banner.options.font", _font);
        grunt.task.run("asciify:banner");

    });


}
