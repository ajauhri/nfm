var count = 1;
var nfm = new NFM();
var computationPlumber;

jsPlumb.bind("ready", function() {
    //chrome fix
    document.onselectstart = function () { return false; };		

    /* initialize jsPlumb */
    plumbing.init();
    jsPlumb.setRenderMode(jsPlumb.SVG);

    /* initialize tool box */
    initToolBox();

    /* initialize how to box */
    initHowToBox();
    
    /* initialize computation box */
    initCompBox();
       
    /* event Listener for addState button */    
    initAddState();
});


;(function() {
    window.plumbing = { 
		init :function() {
		    jsPlumb.Defaults.PaintStyle = { strokeStyle:"gray", lineWidth:2 };	
			jsPlumb.importDefaults({
				Endpoint : ["Dot", {radius:2}],
				HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:2 },
				ConnectionOverlays : [
					[ "Arrow", { 
						location:1,
						id:"arrow",
	                    length:14,
	                    foldback:0.8
					} ]
				]
			});

			jsPlumb.bind("click", function(c) { 
				jsPlumb.detach(c);
                nfm.removeTransition(c.sourceId, c.targetId);
                var key = c.sourceId + " to " + c.targetId;
                var delta_id = "#deltas option[value='"+key+"']";
                $(delta_id).remove();
			});

            jsPlumb.bind("jsPlumbConnection", function(conn) {
                conn.connection.setPaintStyle({strokeStyle:'rgb(54, 164, 207)'});
                var key = conn.sourceId + " to " + conn.targetId;
                if (!nfm.transition.get(conn.sourceId))
                    nfm.transition.put(conn.sourceId, new HashMap());
                nfm.transition.get(conn.sourceId).put(conn.targetId, undefined);
                var delta_id = "#deltas option[value='"+key+"']";
                if ($(delta_id).length == 0) { 
                    $('#deltas')
                         .append($('<option>', { value : key})
                         .text(key)); 
                }
                else
                    jsPlumb.detach(conn);
            });
    	}
	};

    initAddState = function() {
        $('#addState').bind('click', function() {
            var state_id = "state_"+count;
            var state = $("<div class='w_node' id='"+state_id+"'>#"+count+"&nbsp<div class='ep'></div></div>");
            
            /* each state consists of:
             * - start indicator
             * - accept indicator
             */
            var accept = $("<div class='accept'>A</div>");
            var start = $("<div class='start'>S</div>");
            state.append(accept);
            state.append(start);
            addAcceptBtListener(accept);
            addStartBtListener(start);

            $('#main').append(state);
            
            addPlumbProp(state_id, state);
           
            /* update global state variables */ 
            nfm.addState(state_id);
            count += 1;
        });
    };
    
    initToolBox = function() {
        $("#toolBox").draggable();
        $("input:text, input:password, input[type=email]").button().addClass("ui-textfield");
        $("#evaluate").click(function(e) {
            nfm.input = $("#input").val();
            if (!validate(e)) { 
                e.stopPropagation();
                return false;
            }
            
            nfm.evaluate();
        });

        initTransitions();
        initAlphabets();
        initEpsilonClick();
    };

    initHowToBox = function() {
        $("#howTo").draggable();
        $("#howTo").html("How to use this demo? " +
                "<ul><li>Add multiple states using the `Add State` link. </li>" +
                "<li>Transition arrows between states can be made by holding the mouse pointer on <img src='square_block.png'/> symbol of the source state " +
                "and dragging it to the desitination state. Self-loops can also be made by dragging the arrow to the source state itself.</li> " + 
                "<li>Every transistion will have a entry in the `Transition` drop down list. By selecting the transition from the drop down list," +
                " the transition symbol(s) can be entered in the `Transistion symbols` box.</li>"+
                "<li>Every transistion should have at least one symbol. Multiple symbols should be separatd by commas. " +
                "Example: a,c,e,&#400;,f. For convenience, the &#400; symbol can be entered by pressing the &#400; link provided in the Glossary.</li> " +
                "<li>The automaton should have one start state and at least one accept state.</li> " +
                "<li>The input string to be computed by the automaton can be provided in the `Input String` box.</li>" +
                "<li>Press the `Compute` button to see the result in the bottom section of the page.</li></ul>");
    };

    initCompBox = function() {
        $(".computation").draggable();
        computationPlumber = jsPlumb.getInstance({
            Connector : [ "StateMachine", { curviness:20 } ],
			DragOptions : { cursor: "pointer", zIndex:2000 },
			PaintStyle : { strokeStyle:"gray", lineWidth:2 },
			Endpoint : [ "Dot", {radius:2} ],
			Anchor :  "Continuous",
            ConnectionOverlays : [
            [ "Arrow", { 
                location:1,
                id:"arrow",
	            length:14,
	            foldback:0.8
            }]]
        });
    };

    initTransitions = function() {
        $("#deltas").change(function() {
            var delta = $(this).val().split("to");
            var source = trim(delta[0]);
            var target =  trim(delta[1]);
            var alphabets = nfm.transition.get(source).get(target);
            $("#alphabets").val(alphabets);
        });
    };

    initAlphabets = function() {
        $("#alphabets").attr("placeholder", "Transition symbols");
        $("#input").attr("placeholder", "Input string");
        $("#alphabets").blur(function() {
            if ($("#deltas").find(":selected").text()) {
                var delta = $("#deltas").find(":selected").text().split("to");
                var source = trim(delta[0]);
                var target = trim(delta[1]);
                nfm.transition.get(source).put(target, this.value); 
            }
        });
    };   

    initEpsilonClick = function() {
        $("#e-symbol").click(function () {
            $("#alphabets").val($("#alphabets").val() + "Ɛ");
        });
    };

 })();
