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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Planets = require( 'PENDULUM_LAB/common/Planets' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SliderTitleNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/SliderTitleNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var GravityString = require( 'string!PENDULUM_LAB/gravity' );
  var LotsString = require( 'string!PENDULUM_LAB/lots' );
  var NoneString = require( 'string!PENDULUM_LAB/none' );
  var WhatIsTheValueOfGravity = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  // constants
  var FONT = new PhetFont( 11 );
  var QUESTION_FONT = new PhetFont( 10 );
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
    var self = this;

    VBox.call( this, _.extend( {
      spacing: 4,
      align: 'left'
    }, options ) );

    // add slider's title
    this.addChild( new SliderTitleNode( GravityString ) );

    // create slider for gravity property
    var hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: TRACK_SIZE,
      thumbSize: new Dimension2( 10, 19 )
    } );
    hSlider.addMajorTick( gravityPropertyRange.min, new Text( NoneString, {font: FONT} ) );
    hSlider.addMajorTick( gravityPropertyRange.max, new Text( LotsString, {font: FONT} ) );

    // create question text node instead of slider for planet X
    var questionText = new Node( {children: [
      new Rectangle( 0, 0, hSlider.width, hSlider.height ),
      new Text( WhatIsTheValueOfGravity, {font: QUESTION_FONT, centerX: hSlider.width / 2, centerY: hSlider.height / 2} )
    ]} );

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
      var hSliderIndex, questionTextIndex;

      if ( planet === Planets.PLANET_X ) {
        // remove slider
        hSliderIndex = self.indexOfChild( hSlider );
        if ( hSliderIndex !== -1 ) {
          self.removeChildWithIndex( hSlider, hSliderIndex );
        }

        // add question text
        questionTextIndex = self.indexOfChild( questionText );
        if ( questionTextIndex === -1 ) {
          self.insertChild( 1, questionText );
        }
      }
      else {
        // remove question text
        questionTextIndex = self.indexOfChild( questionText );
        if ( questionTextIndex !== -1 ) {
          self.removeChildWithIndex( questionText, questionTextIndex );
        }

        // add slider
        hSliderIndex = self.indexOfChild( hSlider );
        if ( hSliderIndex === -1 ) {
          self.insertChild( 1, hSlider );
        }
      }
    } );
  }

  return inherit( VBox, GravitySliderWithListNode );
} );
