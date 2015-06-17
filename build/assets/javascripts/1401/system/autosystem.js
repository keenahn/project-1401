/* autonomous.js */
define ([
	'1401/settings',
	'1401/system/renderer',
	'1401/system/visualfactory',
	'1401/system/piecefactory',
	'1401/system/logicfactory'
], function ( 
	SETTINGS,
	RENDERER,
	VISUALFACTORY,
	PIECEFACTORY,
	LOGICFACTORY
) {

	var DBGOUT = true;


/**	Autosystem **************************************************************\

	This module centralizes all the autonomous updates that are handled by
	the 1401 system, so the game programmer doesn't have to remember to add
	this to their game-main loop. It's called directly from master.js.

	Generally this applies to system-level services in certain cases

	VisualFactory - sprite animations need periodic updating
	PieceFactory - state machines and ai need periodic updating
	Renderer - copying of video to textures need to occur periodically
	Timers - active timers need to be incremented and tested
	Trigger - triggers whose conditions are met need to be set
	Semaphores - signaling systems need to be set/reset per frame
	Oscillators - need to produce an updated value

	Autosystem is the main interface to managing autonomous 1401 systems,
	and is included selectively. You probably will not need to use it.
	SysLoop includes it so it can call PieceFactory.PiecesUpdate() without
	including it directly to avoid creating interdepencies.


/** MODULE PRIVATE VARIABLES *************************************************/



/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "autosystem";

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ Called by Master
/*/	API.Initialize = function () {
		LOGICFACTORY.Initialize();
	};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ Called by Master
/*/	API.LoadAssets = function ( callback ) {
		VISUALFACTORY.LoadAssets (callback);
	};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Called by Master so system modules can do housekeeping before GameStep
/*/	API.HeartBeat = function ( interval_ms ) {
		VISUALFACTORY.HeartBeat( interval_ms );
		PIECEFACTORY.HeartBeat( interval_ms );
		RENDERER.HeartBeat( interval_ms );
		LOGICFACTORY.HeartBeat( interval_ms );
	};


/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;


});