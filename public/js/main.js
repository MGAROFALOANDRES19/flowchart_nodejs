 function init() {
   if(localStorage.getItem("flecha") === null ||  localStorage.getItem("flecha") === undefined){
     localStorage.setItem("flecha", "triangle")
   }
   
   cargar();
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,  // must be true to accept drops from the Palette
          "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
          "LinkRelinked": showLinkLabel,
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          "undoManager.isEnabled": true  // enable undo & redo
        });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });

    // helper definitions for node templates

    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center,
          //isShadowed: true,
          //shadowColor: "#888",
          // handle mouse enter/leave events to show/hide the ports
          mouseEnter: function (e, obj) { showPorts(obj.part, true); },
          mouseLeave: function (e, obj) { showPorts(obj.part, false); }
        }
      ];
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    
                         //*****   PUNTOS PARA CONECTAR EL FLUJO    ***
    function makePort(name, spot, output, input) {
      // the port is basically just a small circle that has a white stroke when it is made visible
      return $(go.Shape, "Square",//cambia la forma del puerto
               {
                  fill: "transparent",
                  stroke: null,  // this is changed to "white" in the showPorts function
                  desiredSize: new go.Size(8, 8),
                  alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                  portId: name,  // declare this object to be a "port"
                  fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                  fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                  cursor: "pointer"  // show a different cursor to indicate potential link point
               });
    }


            
    // define the Node templates for regular nodes

    var lightText = 'whitesmoke'; // color de la letra de las figura

                                ///***** R   E   C  T   A    N    G   U   L   O  /   R  O  M  B  O****
    myDiagram.nodeTemplateMap.add("",  // the default category
      $(go.Node, "Spot", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            { fill: "#9A2EFE", stroke: null },
            new go.Binding("figure", "figure")), // AQUI LE MANDO DOS FIGURAS 
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: lightText,
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        
                  //*******PUERTOS PARA LOS NODOS DEL FLUJO -:-TOP LEFT RIGHT BOTTON
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));
      
      
      ///***** Triangulo****
        
    myDiagram.nodeTemplateMap.add("triangulo",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Triangle",
            { minSize: new go.Size(40, 40), fill: "#FA58F4", stroke: null }),
          $(go.TextBlock, "triangulo",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));
      
      
      
      
                                ///***** C I R C U L O   COMENZAR ****
        
    myDiagram.nodeTemplateMap.add("Start",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
          $(go.TextBlock, "Start",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      ));
      
      
                              ///***** C I R C U L O   TERMINAR****

    myDiagram.nodeTemplateMap.add("End",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
          $(go.TextBlock, "End",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, false, true)
      ));



                       ///*****  C O M E N T A R ****
                       
    myDiagram.nodeTemplateMap.add("Comment",
      $(go.Node, "Auto", nodeStyle(),
        $(go.Shape, "File",
          { fill: "#F2F5A9", stroke: null }),
        $(go.TextBlock,
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: "bold 12pt Helvetica, Arial, sans-serif",
            stroke: '#454545'
          },
          new go.Binding("text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
      ));


    // replace the default Link template in the linkTemplateMap
   
     
     // Typical custom definition:
go.Shape.defineArrowheadGeometry("Zigzag", "M0,4 L1,8 3,0 5,8 7,0 8,4");
go.Shape.defineArrowheadGeometry("Standard", "F1 m 0,0 l 8,4 -8,4 2,-4 z");
go.Shape.defineArrowheadGeometry("Backward", "F1 m 8,0 l -2,4 2,4 -8,-4 z");
go.Shape.defineArrowheadGeometry("Triangle", "F1 m 0,0 l 8,4.62 -8,4.62 z");
go.Shape.defineArrowheadGeometry("BackwardTriangle", "F1 m 8,4 l 0,4 -8,-4 8,-4 0,4 z");
go.Shape.defineArrowheadGeometry("Boomerang", "F1 m 0,0 l 8,4 -8,4 4,-4 -4,-4 z");
go.Shape.defineArrowheadGeometry("BackwardBoomerang", "F1 m 8,0 l -8,4 8,4 -4,-4 4,-4 z");
go.Shape.defineArrowheadGeometry("SidewaysV", "m 0,0 l 8,4 -8,4 0,-1 6,-3 -6,-3 0,-1 z");
go.Shape.defineArrowheadGeometry("BackwardV", "m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z");

go.Shape.defineArrowheadGeometry("OpenTriangle", "m 0,0 l 8,4 -8,4");
go.Shape.defineArrowheadGeometry("BackwardOpenTriangle", "m 8,0 l -8,4 8,4");
go.Shape.defineArrowheadGeometry("OpenTriangleLine", "m 0,0 l 8,4 -8,4 m 8.5,0 l 0,-8");
go.Shape.defineArrowheadGeometry("BackwardOpenTriangleLine", "m 8,0 l  -8,4 8,4 m -8.5,0 l 0,-8");

go.Shape.defineArrowheadGeometry("OpenTriangleTop", "m 0,0 l 8,4 m 0,4");
go.Shape.defineArrowheadGeometry("BackwardOpenTriangleTop", "m 8,0 l -8,4 m 0,4");
go.Shape.defineArrowheadGeometry("OpenTriangleBottom", "m 0,8 l 8,-4");
go.Shape.defineArrowheadGeometry("BackwardOpenTriangleBottom", "m 0,4 l 8,4");

go.Shape.defineArrowheadGeometry("HalfTriangleTop", "F1 m 0,0 l 0,4 8,0 z m 0,8");
go.Shape.defineArrowheadGeometry("BackwardHalfTriangleTop", "F1 m 8,0 l 0,4 -8,0 z m 0,8");
go.Shape.defineArrowheadGeometry("HalfTriangleBottom", "F1 m 0,4 l 0,4 8,-4 z");
go.Shape.defineArrowheadGeometry("BackwardHalfTriangleBottom", "F1 m 8,4 l 0,4 -8,-4 z");

go.Shape.defineArrowheadGeometry("ForwardSemiCircle", "m 4,0 b 270 180 0 4 4");
go.Shape.defineArrowheadGeometry("BackwardSemiCircle", "m 4,8 b 90 180 0 -4 4");

go.Shape.defineArrowheadGeometry("Feather", "m 0,0 l 3,4 -3,4");
go.Shape.defineArrowheadGeometry("BackwardFeather", "m 3,0 l -3,4 3,4");
go.Shape.defineArrowheadGeometry("DoubleFeathers", "m 0,0 l 3,4 -3,4 m 3,-8 l 3,4 -3,4");
go.Shape.defineArrowheadGeometry("BackwardDoubleFeathers", "m 3,0 l -3,4 3,4 m 3,-8 l -3,4 3,4");
go.Shape.defineArrowheadGeometry("TripleFeathers", "m 0,0 l 3,4 -3,4 m 3,-8 l 3,4 -3,4 m 3,-8 l 3,4 -3,4");
go.Shape.defineArrowheadGeometry("BackwardTripleFeathers", "m 3,0 l -3,4 3,4 m 3,-8 l -3,4 3,4 m 3,-8 l -3,4 3,4");

go.Shape.defineArrowheadGeometry("ForwardSlash", "m 0,8 l 5,-8");
go.Shape.defineArrowheadGeometry("BackSlash", "m 0,0 l 5,8");
go.Shape.defineArrowheadGeometry("DoubleForwardSlash", "m 0,8 l 4,-8 m -2,8 l 4,-8");
go.Shape.defineArrowheadGeometry("DoubleBackSlash", "m 0,0 l 4,8 m -2,-8 l 4,8");
go.Shape.defineArrowheadGeometry("TripleForwardSlash", "m 0,8 l 4,-8 m -2,8 l 4,-8 m -2,8 l 4,-8");
go.Shape.defineArrowheadGeometry("TripleBackSlash", "m 0,0 l 4,8 m -2,-8 l 4,8 m -2,-8 l 4,8");

go.Shape.defineArrowheadGeometry("Fork", "m 0,4 l 8,0 m -8,0 l 8,-4 m -8,4 l 8,4");
go.Shape.defineArrowheadGeometry("BackwardFork", "m 8,4 l -8,0 m 8,0 l -8,-4 m 8,4 l -8,4");
go.Shape.defineArrowheadGeometry("LineFork", "m 0,0 l 0,8 m 0,-4 l 8,0 m -8,0 l 8,-4 m -8,4 l 8,4");
go.Shape.defineArrowheadGeometry("BackwardLineFork", "m 8,4 l -8,0 m 8,0 l -8,-4 m 8,4 l -8,4 m 8,-8 l 0,8");
go.Shape.defineArrowheadGeometry("CircleFork", "F1 m 6,4 b 0 360 -3 0 3 z m 0,0 l 6,0 m -6,0 l 6,-4 m -6,4 l 6,4");
go.Shape.defineArrowheadGeometry("BackwardCircleFork", "F1 m 0,4 l 6,0 m -6,-4 l 6,4 m -6,4 l 6,-4 m 6,0 b 0 360 -3 0 3");
go.Shape.defineArrowheadGeometry("CircleLineFork", "F1 m 6,4 b 0 360 -3 0 3 z m 1,-4 l 0,8 m 0,-4 l 6,0 m -6,0 l 6,-4 m -6,4 l 6,4");
go.Shape.defineArrowheadGeometry("BackwardCircleLineFork", "F1 m 0,4 l 6,0 m -6,-4 l 6,4 m -6,4 l 6,-4 m 0,-4 l 0,8 m 7,-4 b 0 360 -3 0 3");

go.Shape.defineArrowheadGeometry("Circle", "F1 m 8,4 b 0 360 -4 0 4 z");
go.Shape.defineArrowheadGeometry("Block", "F1 m 0,0 l 0,8 8,0 0,-8 z");
go.Shape.defineArrowheadGeometry("StretchedDiamond", "F1 m 0,3 l 5,-3 5,3 -5,3 -5,-3 z");
go.Shape.defineArrowheadGeometry("Diamond", "F1 m 0,4 l 4,-4 4,4 -4,4 -4,-4 z");
go.Shape.defineArrowheadGeometry("Chevron", "F1 m 0,0 l 5,0 3,4 -3,4 -5,0 3,-4 -3,-4 z");
go.Shape.defineArrowheadGeometry("StretchedChevron", "F1 m 0,0 l 8,0 3,4 -3,4 -8,0 3,-4 -3,-4 z");

go.Shape.defineArrowheadGeometry("NormalArrow", "F1 m 0,2 l 4,0 0,-2 4,4 -4,4 0,-2 -4,0 z");
go.Shape.defineArrowheadGeometry("X", "m 0,0 l 8,8 m 0,-8 l -8,8");
go.Shape.defineArrowheadGeometry("TailedNormalArrow", "F1 m 0,0 l 2,0 1,2 3,0 0,-2 2,4 -2,4 0,-2 -3,0 -1,2 -2,0 1,-4 -1,-4 z");
go.Shape.defineArrowheadGeometry("DoubleTriangle", "F1 m 0,0 l 4,4 -4,4 0,-8 z  m 4,0 l 4,4 -4,4 0,-8 z");
go.Shape.defineArrowheadGeometry("BigEndArrow" , "F1 m 0,0 l 5,2 0,-2 3,4 -3,4 0,-2 -5,2 0,-8 z");
go.Shape.defineArrowheadGeometry("ConcaveTailArrow", "F1 m 0,2 h 4 v -2 l 4,4 -4,4 v -2 h -4 l 2,-2 -2,-2 z");
go.Shape.defineArrowheadGeometry("RoundedTriangle", "F1 m 0,1 a 1,1 0 0 1 1,-1 l 7,3 a 0.5,1 0 0 1 0,2 l -7,3 a 1,1 0 0 1 -1,-1 l 0,-6 z");
go.Shape.defineArrowheadGeometry("SimpleArrow", "F1 m 1,2 l -1,-2 2,0 1,2 -1,2 -2,0 1,-2 5,0 0,-2 2,2 -2,2 0,-2 z");
go.Shape.defineArrowheadGeometry("AccelerationArrow" , "F1 m 0,0 l 0,8 0.2,0 0,-8 -0.2,0 z m 2,0 l 0,8 1,0 0,-8 -1,0 z m 3,0 l 2,0 2,4 -2,4 -2,0 0,-8 z");
go.Shape.defineArrowheadGeometry("BoxArrow" , "F1 m 0,0 l 4,0 0,2 2,0 0,-2 2,4 -2,4 0,-2 -2,0 0,2 -4,0 0,-8 z");
go.Shape.defineArrowheadGeometry("TriangleLine" , "F1 m 8,4 l -8,-4 0,8 8,-4 z m 0.5,4 l 0,-8");

go.Shape.defineArrowheadGeometry("CircleEndedArrow" , "F1 m 10,4 l -2,-3 0,2 -2,0 0,2 2,0 0,2 2,-3 z m -4,0 b 0 360 -3 0 3 z");

go.Shape.defineArrowheadGeometry("DynamicWidthArrow" , "F1 m 0,3 l 2,0 2,-1 2,-2 2,4 -2,4 -2,-2 -2,-1 -2,0 0,-2 z");
go.Shape.defineArrowheadGeometry("EquilibriumArrow" , "m 0,3 l 8,0 -3,-3 m 3,5 l -8,0 3,3");
go.Shape.defineArrowheadGeometry("FastForward" , "F1 m 0,0 l 3.5,4 0,-4 3.5,4 0,-4 1,0 0,8 -1,0 0,-4 -3.5,4 0,-4 -3.5,4 0,-8 z");
go.Shape.defineArrowheadGeometry("Kite", "F1 m 0,4 l 2,-4 6,4 -6,4 -2,-4 z");
go.Shape.defineArrowheadGeometry("HalfArrowTop", "F1 m 0,0 l 4,4 4,0 -8,-4 z m 0,8");
go.Shape.defineArrowheadGeometry("HalfArrowBottom", "F1 m 0,8 l 4,-4 4,0 -8,4 z");
go.Shape.defineArrowheadGeometry("OpposingDirectionDoubleArrow" , "F1 m 0,4 l 2,-4 0,2 4,0 0,-2 2,4 -2,4 0,-2 -4,0 0,2 -2,-4 z");
go.Shape.defineArrowheadGeometry("PartialDoubleTriangle" , "F1 m 0,0 4,3 0,-3 4,4 -4,4 0,-3 -4,3 0,-8 z");
go.Shape.defineArrowheadGeometry("LineCircle", "F1 m 0,0 l 0,8 m 7 -4 b 0 360 -3 0 3 z");
go.Shape.defineArrowheadGeometry("DoubleLineCircle" , "F1 m 0,0 l 0,8 m 2,-8 l 0,8 m 7 -4 b 0 360 -3 0 3 z");
go.Shape.defineArrowheadGeometry("TripleLineCircle" , "F1 m 0,0 l 0,8 m 2,-8 l 0,8 m 2,-8 l 0,8 m 7 -4 b 0 360 -3 0 3 z");
go.Shape.defineArrowheadGeometry("CircleLine" , "F1 m 6 4 b 0 360 -3 0 3 z m 1,-4 l 0,8");
go.Shape.defineArrowheadGeometry("DiamondCircle", "F1 m 8,4 l -4,4 -4,-4 4,-4 4,4 m 8,0 b 0 360 -4 0 4 z");
go.Shape.defineArrowheadGeometry("PlusCircle" , "F1 m 8,4 b 0 360 -4 0 4 l -8 0 z m -4 -4 l 0 8");
go.Shape.defineArrowheadGeometry("OpenRightTriangleTop", "m 8,0 l 0,4 -8,0 m 0,4");
go.Shape.defineArrowheadGeometry("OpenRightTriangleBottom" , "m 8,8 l 0,-4 -8,0");
go.Shape.defineArrowheadGeometry("Line", "m 0,0 l 0,8");
go.Shape.defineArrowheadGeometry("DoubleLine", "m 0,0 l 0,8 m 2,0 l 0,-8");
go.Shape.defineArrowheadGeometry("TripleLine", "m 0,0 l 0,8 m 2,0 l 0,-8 m 2,0 l 0,8");
go.Shape.defineArrowheadGeometry("PentagonArrow", "F1 m 8,4 l -4,-4 -4,0 0,8 4,0 4,-4 z");
// Typical usage in a link template:
   
     
    myDiagram.linkTemplate =
      $(go.Link,   // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5, toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },// cuando seleccionas
          mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
         new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $(go.Shape,  // the arrowhead
          { toArrow: localStorage.getItem("flecha"), fill: "gray"}),
        $(go.Panel, "Auto",  // the link label, normally not visible
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle",  // the label shape
            { fill: "#FF0000", stroke: null }),
          $(go.TextBlock, "",  // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );



    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
    
      if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    load();  // load an initial diagram from some JSON text

    // initialize the Palette that is on the left side of the page
    myPalette =
      $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { category: "Start", text: "Start" },
            { text: "Steep" },
            { text: "???", figure: "Diamond" },
           // { category: "triangulo", text: "triangulo" },
            { category: "End", text: "End" },
            { category: "Comment", text: "Comment" }
          ])
        });

    // The following code overrides GoJS focus to stop the browser from scrolling
    // the page when either the Diagram or Palette are clicked or dragged onto.

    function customFocus() {
      var x = window.scrollX || window.pageXOffset;
      var y = window.scrollY || window.pageYOffset;
      go.Diagram.prototype.doFocus.call(this);
      window.scrollTo(x, y);
    }

    myDiagram.doFocus = customFocus;
    myPalette.doFocus = customFocus;


  } // end init

  // Make all ports on a node visible when the mouse is over the node
  function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
        port.stroke = (show ? "white" : null);
      });
  }

       function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


escape = function (str) {
  return str
    .replace(/[\\]/g, '')
    .replace(/[\/]/g, '')
    .replace(/[\/n]/g, 'n')
    .replace(/[\b]/g, '')
    .replace(/[\f]/g, '')
    .replace(/[\n]/g, 'n')
    .replace(/[\r]/g, '')
    .replace(/[\t]/g, '');
};

  // Show the diagram's model in JSON format that the user may edit
  function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
      
      var data = JSON.parse(localStorage.getItem("users"));
        
        $.each(data, function(i, item) {
            
            if(i = "flowcharts"){
                $.each(item.flowcharts, function(i2, item2) {
                  if(item.username == getQueryVariable("username") && item2.title == getQueryVariable('title')){
                    
                      var model = JSON.parse($('#mySavedModel').val());
                      console.log(model);
                      item2.model.push(model);
                      console.log(localStorage.getItem("users"));
                      var myJSON = JSON.stringify(data)
                      console.log(myJSON);
                      localStorage.setItem("users", escape(myJSON))
                  }
                });
               }
                
            
        });
   
      
  }
  
  
  function cargar(){
    var url=window.location.href;
    var nombre=url.split('=');//nombre del proyecto
    var data=JSON.parse(localStorage.getItem("users"));
    $.each(data, function(i,item){
      if(i="flowcharts"){ // flowcharts es el diagrama
        $.each(item.flowcharts, function(i2,item2) {
          if(item2.title==getQueryVariable("title")){// nombre es el nombre 
              var tempText = JSON.stringify(item2.model).slice(1, -1);
              console.log("estamos");
            document.getElementById("mySavedModel").value=tempText;
              load()
          }
        });
      }
    });
  }
  
  
  
  function load() {
    try {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}
catch(err) {
    console.log("can't load");
}
    
  }

  // add an SVG rendering of the diagram at the end of this page
  function makeSVG() {
    var svg = myDiagram.makeSvg({
        scale: 0.5
      });
    svg.style.border = "1px solid black";
    obj = document.getElementById("SVGArea");
    obj.appendChild(svg);
    if (obj.children.length > 0) {
      obj.replaceChild(svg, obj.children[0]);
    }
  }
  
  function flecha(){
    /*var dato = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage.getItem('users'))); //preparo la data para ser adjuntada al link de exportación
    $('.exportar').attr('href', 'data:' + dato);
    //var slug = string_to_slug(title); //convierto el titulo de la partirura a slug para que el archivo contenga ese nombre
    $('.exportar').attr('download', 'datos.json'); // indico el nombre con el cual se descargará el archivo
    $('.exportar').trigger('click'); // El trigger() método activa el evento especificado y el comportamiento predeterminado de un evento */
    
  localStorage.setItem("flecha", "circle");
  location.reload();
      
   
}
