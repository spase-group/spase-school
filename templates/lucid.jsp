<%@ page 
   import="java.io.File"
   import="java.io.FileReader"
   import="java.io.BufferedReader"
   import="java.util.ArrayList"
   import="java.lang.Integer"
   import="java.io.File"
   import="java.io.FileFilter"
   import="java.text.SimpleDateFormat" 
   import="java.util.Arrays" 
   import="java.util.Comparator" 
%>

<%! 
      public String whereFrom(HttpServletRequest req) {
         HttpSession ses = req.getSession();

         return req.getRemoteHost();
     }
     
     /**
     * Retrieve the table of contents (TOC) for the current directory.
     * This is stored in the "toc.txt" file. Format of the file is:
     * 
     *    TOC Name, file path
     *
     * Comments are lines which begin with "#"
     * If an entry matches the passed pageTag, then the item is marked as "warm".
     **/
     public String tocMenu(HttpServletRequest req, String pageTag) {
        String path = req.getRealPath(req.getServletPath());
        ArrayList<String> menuList = new ArrayList<String>();
        
        menuList = tocMenu(path, pageTag, menuList, 1);
        
        return makeMenu(menuList);
     }
      
     public ArrayList<String> tocMenu(String path, String pageTag, ArrayList<String> seed, int depth) {
      ArrayList<String> tocList = new ArrayList<String>();
      String warm = "";
      
      File pathName = new File (path);
      
      File tocFile = new File(pathName.getParent() + "/toc.txt");
      try {
         String line = "";
         String context = null;
         
         BufferedReader reader = new BufferedReader(new FileReader(tocFile));
         while((line = reader.readLine()) != null) {
            if(line.startsWith("#")) continue;	// Comment
            if(line.startsWith("%Context:")) {	// Context
                String[] part = line.split(":", 2);
                if(part.length == 2) context = part[1].trim();
            }
            if(line.startsWith("%")) continue;	// Directive
            
            String[] part = line.split(",", 3);
            if(part.length < 3) continue;
            // A little clean-up
            part[0] = part[0].trim();
            part[1] = part[1].trim();
            part[2] = part[2].trim();
            
            warm = "-";
            if(pageTag.compareToIgnoreCase(part[0]) == 0) warm = "+";
            
            String relative = "";
            for(int i = 1; i < depth; i++) relative += "../";
            
            tocList.add(depth + "," + warm + "," + part[0] + "," + relative + part[1] + "," + part[2]);
            if(pageTag.compareToIgnoreCase(part[0]) == 0) tocList.addAll(seed);
         }
         if(context != null) {	// Build up surrounding menu
		      File parentPath = new File (path);
            tocList = tocMenu(parentPath.getParent(), context, tocList, depth+1);
         }
      } catch(Exception e) {
      // Do nothing
      }
      
      return tocList;
    }

    /** 
     * ArrayList is in compact menu format of
     *    depth, warm, tag, link, tutor text
     **/
    public String makeMenu(ArrayList<String> menuList) {
       int maxDepth = -1;
       int depth = 1;
       String	first = " first";
       String	toc = "";
       String	warm = "";
       int n = 1;
       int nItems = menuList.size();
       
       for(String line : menuList) {
          String[] part = line.split(",", 5);
          if(part.length != 5) continue;	// malformed 
          depth = Integer.parseInt(part[0]);
          if(maxDepth == -1) maxDepth = depth;
          warm = "";
          if(part[1].compareTo("+") == 0) warm = "class=\"warm\"";
          
          toc += "<li class=\"l" + (maxDepth - depth) + first +"\"><a href=\"" + part[3].trim() + "\" " + warm + ">" 
          + part[2].trim()
          + "<span class=\"tutor\">" + part[4] + "</span>"
          + "</a></li>";
          first = "";
          n++;
          if(n == nItems) first = " last";
          
       }
       
       return toc;
    }

   String mFilterMask = ".*";
   
   /**
    * Generate a list files matching a pattern which are 
    * in the folder than contains the servlet.
    **/
  public File[] getFileList(HttpServletRequest req, String filter) {
     File doc = new File(req.getRealPath(req.getServletPath()));
     File folder = new File(doc.getParent());
     // Find all release versions
     mFilterMask = filter;
     File[] list = folder.listFiles(new FileFilter()	{ public boolean accept(File pathname) { return pathname.getName().matches(mFilterMask); } } );
     mFilterMask = ".*";
     
     // Sort 
     java.util.Arrays.sort(list, new Comparator()	{ public int compare(Object o1, Object o2) { return -((File)o1).getName().compareToIgnoreCase(((File)o2).getName()); } } ); 
   
     return list;
   }
   
   /**
    * Extact version from a file name.
    * It assumes the format of the filename is "base-version.ext";
    **/
   public String getFileVersion(File file) {
      // Get current version
      String	version = "none";
   
      String[] part = file.getName().split("[-.]", 2);
      if(part.length > 1) version = part[1].replaceAll("_", ".");
      
      int n = version.lastIndexOf('.');
      if(n != -1) version = version.substring(0, n);
      return version;
   }

%>
