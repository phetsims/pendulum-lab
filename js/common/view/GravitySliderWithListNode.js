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
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Planets = require( 'PENDULUM_LAB/common/Planets' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var LotsString = require( 'string!PENDULUM_LAB/lots' );
  var NoneString = require( 'string!PENDULUM_LAB/none' );
  var WhatIsTheValueOfGravity = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  // constants
  var FONT = new PhetFont( 9 );
  var FONT_QUESTION = new PhetFont( 8.5 );

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
    var container = new Node();

    VBox.call( this, _.extend( {spacing: 4}, options ) );

    // create slider for gravity property
    var hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE
    } );
    hSlider.addMajorTick( gravityPropertyRange.min, new Text( NoneString, {font: FONT} ) );
    hSlider.addMajorTick( gravityPropertyRange.max, new Text( LotsString, {font: FONT} ) );
    container.addChild( hSlider );

    // create question text node instead of slider for planet X
    var questionText = new Node( {
      children: [
        new Rectangle( hSlider.bounds.minX, hSlider.bounds.minY, hSlider.width, hSlider.height ),
        new Text( WhatIsTheValueOfGravity, {
          font: FONT_QUESTION,
          centerX: hSlider.bounds.minX + hSlider.width / 2,
          centerY: hSlider.bounds.minY + hSlider.height / 2
        } )
      ]
    } );
    container.addChild( questionText );

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

    // if planet X was chosen then replace slider to question
    planetProperty.link( function( planet ) {
      if ( planet === Planets.PLANET_X ) {
        hSlider.visible = false;
        questionText.visible = true;
      }
      else {
        hSlider.visible = true;
        questionText.visible = false;
      }
    } );

    this.addChild( container );
  }

  return inherit( VBox, GravitySliderWithListNode );
} );
