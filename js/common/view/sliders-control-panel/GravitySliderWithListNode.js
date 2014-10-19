// Copyright 2002-2014, University of Colorado Boulder

/**
 * Gravity slider and planet list node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SliderTitleNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/SliderTitleNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var GravityString = require( 'string!PENDULUM_LAB/gravity' );
  var LotsString = require( 'string!PENDULUM_LAB/lots' );
  var NoneString = require( 'string!PENDULUM_LAB/none' );

  // constants
  var FONT = new PhetFont( 11 );
  var TRACK_SIZE = new Dimension2( 113, 0 );

  /**
   * Constructor for the gravity slider control
   * @param {Property} gravityProperty - Property to update by slider
   * @param {Range} gravityPropertyRange - Possible range of gravityProperty value
   * @param {Property} planetProperty - Property to update by combo box
   * @param {Array} planetModels - Models of all planets
   * @param {Node} planetsListNode - Node for displaying planet list. Should be above all other nodes
   * @param {Object} options
   * @constructor
   */
  function GravitySliderWithListNode( gravityProperty, gravityPropertyRange, planetProperty, planetModels, planetsListNode, options ) {
    VBox.call( this, _.extend( {
      spacing: 4,
      align: 'left'
    }, options ) );

    // add slider's title
    this.addChild( new SliderTitleNode( GravityString ) );

    // add slider for gravity property
    var hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: TRACK_SIZE,
      thumbSize: new Dimension2( 10, 19 )
    } );
    hSlider.addMajorTick( gravityPropertyRange.min, new Text( NoneString, {font: FONT} ) );
    hSlider.addMajorTick( gravityPropertyRange.max, new Text( LotsString, {font: FONT} ) );
    this.addChild( hSlider );

    // create planet list menu
    var planetListItems = [];
    planetModels.forEach( function( planetModel ) {
      planetListItems.push( {
        node: new Text( planetModel.title ),
        value: planetModel.name
      } );
    } );

    // add planet menu combo box
    this.addChild( new ComboBox( planetListItems, planetProperty, planetsListNode, {
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3
    } ) );
  }

  return inherit( VBox, GravitySliderWithListNode );
} );
