/* behaviorfactory.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/tree',
	'1401/objects/behaviors/nodes/base',
	'1401/objects/behaviors/nodes/sequence',
	'1401/objects/behaviors/nodes/priority',
	'1401/objects/behaviors/nodes/decorator',
	'1401/objects/behaviors/nodes/condition',
	'1401/objects/behaviors/nodes/action',
	'1401/objects/behaviors/nodes/subtree',
	'1401/objects/behaviors/blackboard'

], function ( 
	SETTINGS,
	BehaviorTree,
	BaseNode,
	Sequence,
	Priority,
	Decorator,
	Condition,
	Action,
	SubTree,
	Blackboard
) {

	var DBGOUT = true;


/**	BehaviorFactory **********************************************************\

    Project 1401's behavior tree implementation and terminology is inspired
    by Renato Pereira's Behavior Tree tutorials, adapted to use 1401's piece
    and class hierarchy. See https://github.com/behavior3/behavior3js for
    his own implementation of Behavior Trees!

    -

	BehaviorFactory implements BehaviorTree assigments to pieces. This keeps 
	AI-specific code out of the Piece classes, so other approaches (e.g. FSM)
	could be used in its place.

	BehaviorFactory uses the Piece.ai property, attaching the following
	properties:

	.ai.behavior 	A BehaviorTree
	.ai.blackboard 	Behavior runtime memory for the piece

	The BehaviorFactory module has two main calls:

	DefineBehavior( name, btreeRoot ) 
		Stores a named behavior tree (BT) for use by multiple pieces. Only one
		instance of a particular named BT exists at a time, though multiple
		pieces may use it. Because there is only a single BT instance, local
		variables can't be implemented in the usual way; the blackboard data
		structure provides this.

	AssignBehavior( name, pish ) 
		Assigns a previously-defined BT to anything with a .ai object (a
		'pish'), initializing its ai.behavior and ai.blackboard properties.
		The blackboard is cleared whenever a BT is assigned to a piece.

	BehaviorFactory is also used to gain access to the various constructors
	for BT nodes. They can be extended to create custom action, decorator, 
	and condition nodes:

		function MyActionNode () {
			// call parent constructor
			BehaviorFactory.ActionNode.call(this);
			...
		}
		// set up inheritance
		MyActionNode.inheritsFrom(BehaviorFactory.ActionNode);
		// define or override new methods
		MyActionNode.method('Open',function(){...});

	BehaviorFactory may eventually handle loading/saving of behavior trees,
	though I am not sure how that would work with actual authoring.


/** MODULE PRIVATE VARIABLES *************************************************/

	// store behavior tree roots in an indexed array for speed
	// dictionary looks-up indexes in m_trees
	var m_behaviors = [];

	// create a default dumb tree object
	// TODO: should use an action node
	var m_default_tree = {};
	m_default_tree.Tick = function ( pish, interval_ms ) {
		console.log(pish.name,"null behavior tick",interval_ms);
	};


/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "behaviorfactory";
	API.SUCCESS = BaseNode.SUCCESS;
	API.FAILURE = BaseNode.FAILURE;
	API.RUNNING = BaseNode.RUNNING;

/// INITIALIZATION //////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Called by Master to initialize logic systems 
/*/	API.Initialize = function () {
	};


/// BEHAVIOR TREE DEFINITIONS ///////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	define a named behavior with a name and a btreeRoot
/*/	API.DefineBehavior = function ( name, btreeRoot ) {
		if ( !(name && btreeRoot) ) {
			console.error("Must pass a Name and a BehaviorTree. Aborting.");
			return;
		}
		// create tree
		name = name.toLowerCase();
		var btree = new BehaviorTree ( name, btreeRoot );
		if (m_behaviors[name]) {
			console.error("'"+name+"' already defined. Aborting.");
			return;
		}
		if (DBGOUT) 
			console.log("creating",name.squote(),"behavior",btree.id.bracket());
		/* add behaviorTree */
		m_behaviors[name] = btree;
	};


/// BEHAVIOR TREE ASSIGNMENT ////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	assign behavior to piece. 
/*/	API.AssignBehavior = function ( name, pish ) {
		if ( !(pish && name) ) {
			var out = "Must pass the Name of behavior and a piece. Aborting";
			console.error(out);
			return;
		}
		name = name.toLowerCase();
		/* create behavior memory if it doesn't exist yet */
		if (pish.ai===null) {
			pish.ai = {};
			pish.ai.blackboard = new Blackboard ();
		}
		// reset the blackboard to be blank
		pish.ai.blackboard.Erase();

		// retrieve the named behavior tree and assign it
		var bt = m_behaviors[name];
		if (bt) {
			pish.ai.behavior = bt;
			pish.ai.blackboard.TreePathPush(bt);
			console.log("assigning",name.squote(),"behavior to",pish.name.bracket());
		} else {
			console.error("behavior",name.squote(),"does not exist. Assigning null behavior to piece",pish.name.bracket());
			pish.ai.behavior = m_default_tree;		
		}

	};


/// COMPOSITE NODES /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.NewSequence = function ( children ) {
		return new Sequence ( children );
	};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.NewPriority = function ( children ) {
		return new Priority ( children );
	};


///	BASE CONSTRUCTORS ///////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Priority 	= Priority;
	API.Sequence 	= Sequence;
	API.BaseNode 	= BaseNode;
	API.Action 		= Action;
	API.Condition 	= Condition;
	API.Decorator 	= Decorator;
	API.SubTree 	= SubTree;
		

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return API;


});