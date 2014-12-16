// Copyright 2002-2014, University of Colorado Boulder

/**
 * Gravity slider and planet list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Planets = require( 'PENDULUM_LAB/common/Planets' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var LotsString = require( 'string!PENDULUM_LAB/lots' );
  var NoneString = require( 'string!PENDULUM_LAB/none' );
  var pattern_0gravityValue_gravityUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0gravityValue.gravityUnitsMetric' );
  var WhatIsTheValueOfGravity = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  // constants
  var FONT = new PhetFont( 9 );
  var FONT_QUESTION = new PhetFont( 8.5 );
  var VALUE_LABEL_SPACING = 4;

  /**
   * Constructor for the gravity slider control
   * @param {Property} gravityProperty - Property to update by slider
   * @param {Range} gravityPropertyOptions - Options for gravity property
   * @param {Property} planetProperty - Property to update by combo box
   * @param {Array} planetModels - Models of all planets
   * @param {Node} planetsListNode - Node for displaying planet list. Should be above all other nodes
   * @param {Object} options
   * @constructor
   */
  function GravitySliderWithListNode( gravityProperty, gravityPropertyOptions, planetProperty, planetModels, planetsListNode, options ) {
    var self = this, container = new Node();

    VBox.call( this, _.extend( {spacing: 4}, options ) );
    this.gravityAdjustmentNode = new VBox( {spacing: VALUE_LABEL_SPACING} );

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

    // create slider for gravity property
    var hSlider = new HSlider( gravityProperty, gravityPropertyOptions.range, {
      majorTickLength: 10,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE
    } );
    hSlider.addMajorTick( gravityPropertyOptions.range.min, new Text( NoneString, {font: FONT} ) );
    hSlider.addMajorTick( gravityPropertyOptions.range.max, new Text( LotsString, {font: FONT} ) );
    container.addChild( this.gravityAdjustmentNode );
    this.gravityAdjustmentNode.addChild( hSlider );

    // create question text node instead of slider for planet X
    this.questionNodeBackground = Rectangle.bounds( this.gravityAdjustmentNode.bounds );
    this.questionNodeText = new Text( WhatIsTheValueOfGravity, {font: FONT_QUESTION} );
    this.questionNode = new Node( {children: [this.questionNodeBackground, this.questionNodeText]} );
    updateQuestionTextPosition( this.questionNodeText, this.gravityAdjustmentNode );
    container.addChild( this.questionNode );

    // if planet X was chosen then replace slider to question
    planetProperty.link( function( planet ) {
      if ( planet === Planets.PLANET_X ) {
        self.gravityAdjustmentNode.visible = false;
        self.questionNode.visible = true;
      }
      else {
        self.gravityAdjustmentNode.visible = true;
        self.questionNode.visible = false;
      }
    } );

    this.addChild( container );
  }

  var updateQuestionTextPosition = function( questionNodeText, gravityAdjustmentNode ) {
    questionNodeText.centerX = gravityAdjustmentNode.bounds.minX + gravityAdjustmentNode.width / 2;
    questionNodeText.centerY = gravityAdjustmentNode.bounds.minY + gravityAdjustmentNode.height / 2;
  };

  return inherit( VBox, GravitySliderWithListNode, {
    // add arrow buttons and value panel
    addTweakers: function( gravityProperty, gravityPropertyOptions ) {
      var arrowButtonMinus,
        valueLabel,
        arrowButtonPlus;

      this.gravityAdjustmentNode.insertChild( 0, new HBox( {
        spacing: VALUE_LABEL_SPACING, children: [
          arrowButtonMinus = new ArrowButton( 'left', function() {
            gravityProperty.value = Util.toFixedNumber( Math.max( gravityPropertyOptions.range.min, gravityProperty.value - gravityPropertyOptions.step ), gravityPropertyOptions.precision );
          }, {scale: 0.5} ),
          new Node( {
            children: [
              new Rectangle( 0, 0, PendulumLabConstants.TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING, arrowButtonMinus.height, 3, 3, {
                centerY: -1,
                centerX: 0,
                fill: '#FFF',
                stroke: 'black',
                lineWidth: 1
              } ),
              valueLabel = new SubSupText( StringUtils.format( pattern_0gravityValue_gravityUnitsMetric, Util.toFixed( gravityProperty.value, gravityPropertyOptions.precision ) ), {
                centerX: 0,
                centerY: -1,
                font: FONT
              } )
            ]
          } ),
          arrowButtonPlus = new ArrowButton( 'right', function() {
            gravityProperty.value = Util.toFixedNumber( Math.min( gravityPropertyOptions.range.max, gravityProperty.value + gravityPropertyOptions.step ), gravityPropertyOptions.precision );
          }, {scale: 0.5} )
        ]
      } ) );

      gravityProperty.link( function( gravityValue ) {
        valueLabel.text = StringUtils.format( pattern_0gravityValue_gravityUnitsMetric, Util.toFixed( gravityValue, gravityPropertyOptions.precision ) );
        arrowButtonMinus.enabled = ( gravityValue > gravityPropertyOptions.range.min );
        arrowButtonPlus.enabled = ( gravityValue < gravityPropertyOptions.range.max );
      } );

      // expand question node
      this.questionNodeBackground.setRectBounds( this.gravityAdjustmentNode.bounds );
      updateQuestionTextPosition( this.questionNodeText, this.gravityAdjustmentNode );
    }
  } );
} );
