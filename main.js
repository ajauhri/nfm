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
            if (alphabets === undefined) {
                $("#alphabets").val("");
             }
            else {
                $("#alphabets").val(alphabets);
            }
        });
    };

    initAlphabets = function() {
        $("#alphabets, #input").attr("placeholder", "not specified");
        $("#alphabets").blur(function() {
            if ($("#deltas").find(":selected").text()) {
                var delta = $("#deltas").find(":selected").text().split("to");
                var source = trim(delta[0]);
                var target = trim(delta[1]);
                nfm.transition.get(source).put(target, this.value);
            }
        });
    };   
 })();
