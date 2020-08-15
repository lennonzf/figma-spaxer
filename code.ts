// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// UI window size
figma.ui.resize(300, 520);

// Font
figma.loadFontAsync({ family: "Roboto", style: "Regular" });




// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.


  // feauter: toggle visibility
  if (msg.type === 'toggle-visibility') {

    console.log("has hit the back");

    //Finds all components containing the name "spaxer"
    const nodes = figma.currentPage.findAll(node => node.type === "COMPONENT" && node.name.includes("spaxer"));
    console.log("traverse result: " + nodes);


    const count = nodes.length;
    console.log("number of spaxer master components is " + count);


    for (let i = 0; i < count; i++) {
      let component_opacity = nodes[i].opacity;

      console.log("in the for loop, the opacity is: " + component_opacity);

      if(component_opacity == 0) {
        console.log("node is not visible");
        nodes[i].opacity = 1;
      }

      if(component_opacity == 1) {
        console.log("node is visible");
        nodes[i].opacity = 0;
      }
      
    }
  }


  // feature: create vertical spacers
  if (msg.type === 'create-spacers') {
    const nodes: SceneNode[] = [];

    
    console.log(msg.height_list + " has been passed to the back");

    // Count the array
    const count = msg.height_list.length;
    console.log("number of elements in the list is " + count);

    var y_axis = 0;


    for (let i = 0; i < count; i++) {

      // current and previous height
      const current_height = parseInt(msg.height_list[i]);
      console.log(current_height);
      var previous_height = 0;
      if (i > 0)
        previous_height = parseInt(msg.height_list[i-1]);

      // define y-axis
      console.log(y_axis);
      y_axis += previous_height + 32;
      console.log(y_axis);
      console.log("y-axis for number " + i + " is " + y_axis);

      //---- create a rectangle
      const rect = figma.createRectangle();

      console.log(rect.type);
      
      // y means the y-axis
      // rect.y = y_axis;

      // fill
      rect.fills = [{type: 'SOLID', color: {r: 0.157, g: 0.369, b: 0.38}}];
      
      // opacity
      rect.opacity = 0.3;

      // stroke
      rect.strokes;
      rect.strokeWeight = 3;

      // resize (width, height)
      rect.resize(msg.width, current_height);

      // figma.currentPage.appendChild(rect);
      // nodes.push(rect);


      //---- create a label
      const label = figma.createText();

      // add in the text
      label.characters = current_height + " px";

      // label.y = y_axis;

      label.resize(msg.width, current_height);
      label.textAlignHorizontal = "CENTER";
      label.textAlignVertical = "CENTER";

      // figma.currentPage.appendChild(label);
      // nodes.push(label);


      //---- create a component
      const spacer = figma.createComponent();
      spacer.appendChild(rect);
      spacer.appendChild(label);

      spacer.resize(msg.width, current_height);
      spacer.y = y_axis;

      spacer.name = "spaxer/vertical/" + current_height + "px";

      
      //---- create a group
      const group = figma.group([rect, label], spacer);
      group.name = "spaxer group";


      //--- Push the spacer onto the page
      figma.currentPage.appendChild(spacer);
      nodes.push(spacer);

    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
