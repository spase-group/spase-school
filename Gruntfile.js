/*
 * assemble-examples <https://github.com/assemble/assemble-examples>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

 /*
 * Required modules
 *
 * npm install grunt-contrib-clean --save
 * npm install grunt-contrib-copy --save
 *
 * To build
 *     grunt
 */

module.exports = function(grunt) {
  'use strict';

  // Load the Assemble plugin.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({

    // Metadata
    site: grunt.file.readYAML('.assemblerc.yml'),

    assemble: {
      options: {
        flatten: true,

        // Add `site` to the context
        site: '<%= site %>',

        // Extensions
        helpers: '<%= site.helpers %>/*.js',

        // Templates
        partials: ['<%= site.includes %>/*.hbs'],
        layoutdir: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>',
		assets: '<%= site.layout %>'
      },
      site: {
        files: [
			{
				expand: true,
				cwd: '<%= site.content %>',
				src: ['**/*.hbs', '!assets/**/*'],
				dest: '<%= site.dest %>/'
			}
		]
      }

    },
	
    copy: {
        main: {
           files: [
			   {
				  expand: true,
				  cwd: '<%= site.content %>', // set 'Current Working Directory'
				  src: '<%= site.assets %>/**', // Read everything inside the cwd
				  dest: '<%= site.dest %>/', // Destination folder
			   },
			   {
				  expand: true,
				  cwd: '<%= site.content %>', // set 'Current Working Directory'
				  src: ['docs/**', '!docs/**/*.hbs'], // Read everything inside the cwd
				  dest: '<%= site.dest %>/', // Destination folder
			   },
			   {
				  expand: true,
				  cwd: '<%= site.templates %>', // set 'Current Working Directory'
				  src: 'CNAME', // Configure for Github pages
				  dest: '<%= site.dest %>/', // Destination folder
			   }
		   ],
       }
	},
	
	// Before generating any new files,
	// remove any previously-created files.
	clean: ['<%= site.dest %>/**']
	
  });

  // The default task to run with the `grunt` command.
  grunt.registerTask('default', ['clean', 'copy', 'assemble']);
};
