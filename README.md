# spase-school

Tutorials on using the SPASE information model and supporting tools.

## Building the web pages
The source for the school is processed with Assemble to generate the web pages.
Grunt is used to to automated the task. To build the pages run 

```
grunt
```

in the root directory. The generated pages will be written in "_gh_pages".

## Testing

To aid in testing a script is included that will run an Nginx container with the generated web pages as
the web site. Use the command 

```
bash start-server.sh
```

in the root directory to start the server. When the container is running the web site can be accessed from

```
http://localhost
```

After each build of the pages do a refresh in the browser to see the changes.


