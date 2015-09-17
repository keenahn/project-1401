/* action.js */
define ([
	'1401/objects/behaviors/basenode'
], function ( 
	BaseNode
) {

	var DBGOUT = true;

/**	BaseAction **************************************************************\

	This is the BaseAction node. Extend it as follows:

	function MyBaseAction ( parms ) {
		// call parent constructor
		BehaviorFactory.BaseAction.call( this, parms );
		...
	}
	// set up inheritance
	MyBaseAction.inheritsFrom( BehaviorFactory.BaseAction );
	// define or override new methods
	MyBaseAction.method('Open',function(){...});

	IMPORTANT! Using 'this' instance properties is unsafe if a Node gets
	reused. Store agent state in the Blackboard using the following methods:

		BBGet( pish, key )
		BBSet( pish, key, value )

	A 'pish' is an object with id and ai properties, not necessarily a piece,
	but is "piecelike" as far as the behavior tree is concerned. 


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function BaseAction ( parms ) {
		//	call the parent constructor		
		BaseNode.call (this);
		this.parms = parms;
		// each node has a name
		this.node_type = 'action';
		this.name = this.node_type+this.id.zeroPad(3);
	}
	/*/ inheritance /*/
	BaseAction.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	/* values are not persistent; must refresh every tick! */
	var blackboard;		// scratch memory for AI in piece
	var status, i;		// running state of piece-ish

/*** see basenode.js for overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseAction.method('Tick', function ( pish, intervalMs ) {
		return this.testReturn;	
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


///////////////////////////////////////////////////////////////////////////////
/** BEHAVIOR PRIVATE FUNCTIONS ***********************************************/

	// Functions should receive entire state in parameters, as stored values
	// in the object instances are not persistent because the same behavior
	// tree's nodes can be used across multiple agents. The blackboard is
	// what provides persistent memory


/** RETURN CONSTRUCTOR *******************************************************/

	return BaseAction;

});