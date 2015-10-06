// Copyright 2002-2014, University of Colorado Boulder

/**
 * Gravity slider and body list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );
  var pattern_0gravityValue_gravityUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0gravityValue.gravityUnitsMetric' );
  var whatIsTheValueOfGravity = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  // constants
  var FONT = new PhetFont( 9 );
  var FONT_LIST = new PhetFont( 12 );
  var TWEAKERS_STEP = Math.pow( 10, -PendulumLabConstants.TWEAKERS_PRECISION );
  var VALUE_LABEL_SPACING = 4;

  /**
   * Constructor for the gravity slider control.
   *
   * @param {Property<number>} gravityProperty - Property to update by slider.
   * @param {Range} gravityPropertyRange - Range of gravity property.
   * @param {Property<object>} bodyTitleProperty - Property to update by combo box.
   * @param {Array.<Body>} bodies - Models of all bodies.
   * @param {Node} bodiesListNode - Node for displaying body list. Should be above all other nodes.
   * @param {Object} [options]
   * @constructor
   */
  function GravitySliderWithListNode( gravityProperty, gravityPropertyRange, bodyTitleProperty, bodies, bodiesListNode, options ) {
    var self = this;
    var container = new Node();

    VBox.call( this, _.extend( { spacing: 4 }, options ) );
    this.gravityAdjustmentNode = new VBox( { spacing: VALUE_LABEL_SPACING } );

    // create body list menu
    var bodyListItems = [];
    bodies.forEach( function( body ) {
      var bodyLabel = new Text( body.title, { font: FONT_LIST } );
      bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body.title
      } );
    } );

    // add body menu combo box
    bodiesListNode.scale( 1.2 );
    this.addChild( new ComboBox( bodyListItems, bodyTitleProperty, bodiesListNode, {
      listPosition: 'above',
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 8
    } ) );

    // create slider for gravity property
    var hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE
    } );
    hSlider.addMajorTick( gravityPropertyRange.min, new Text( noneString, { font: FONT, pickable: false } ) );
    hSlider.addMajorTick( gravityPropertyRange.max, new Text( lotsString, { font: FONT, pickable: false } ) );
    container.addChild( this.gravityAdjustmentNode );
    this.gravityAdjustmentNode.addChild( hSlider );

    // create question text node instead of slider for planet X
    this.questionNodeBackground = Rectangle.bounds( this.gravityAdjustmentNode.bounds );
    this.questionNodeText = new Text( whatIsTheValueOfGravity, { font: FONT } );
    this.questionNode = new Node( { children: [ this.questionNodeBackground, this.questionNodeText ], pickable: false } );
    updateQuestionTextPosition( this.questionNodeText, this.gravityAdjustmentNode );
    container.addChild( this.questionNode );

    // if planet X was chosen then replace slider to question
    bodyTitleProperty.link( function( body ) {
      if ( body === Body.PLANET_X.title ) {
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
    addTweakers: function( gravityProperty, gravityPropertyRange ) {
      // create minus button
      var arrowButtonMinus = new ArrowButton( 'left', function() {
        gravityProperty.value = Util.toFixedNumber( Math.max( gravityPropertyRange.min, gravityProperty.value - TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
      }, { scale: 0.5 } );

      // create value label
      var valueLabel = new SubSupText( StringUtils.format( pattern_0gravityValue_gravityUnitsMetric, Util.toFixed( gravityProperty.value, PendulumLabConstants.TWEAKERS_PRECISION ) ), {
        centerX: 0,
        centerY: -1,
        font: FONT
      } );

      // create plus button
      var arrowButtonPlus = new ArrowButton( 'right', function() {
        gravityProperty.value = Util.toFixedNumber( Math.min( gravityPropertyRange.max, gravityProperty.value + TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
      }, { scale: 0.5 } );

      this.gravityAdjustmentNode.insertChild( 0, new HBox( {
        spacing: VALUE_LABEL_SPACING, children: [
          arrowButtonMinus,
          new Node( {
            pickable: false,
            children: [
              new Rectangle( 0, 0, PendulumLabConstants.TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING, arrowButtonMinus.height, 3, 3, {
                centerY: -1,
                centerX: 0,
                fill: '#FFF',
                stroke: 'black',
                lineWidth: 1
              } ),
              valueLabel
            ]
          } ),
          arrowButtonPlus
        ]
      } ) );

      gravityProperty.link( function( value ) {
        var valueString = value + '';
        var dotPosition = valueString.indexOf( '.' ) + 1;
        var valuePrecision;

        // find value precision
        if ( dotPosition ) {
          valuePrecision = valueString.length - dotPosition;
        }
        else {
          valuePrecision = 0;
        }

        valueLabel.text = StringUtils.format( pattern_0gravityValue_gravityUnitsMetric, Util.toFixed( value, PendulumLabConstants.TWEAKERS_PRECISION ) );
        arrowButtonMinus.enabled = ( value > gravityPropertyRange.min );
        arrowButtonPlus.enabled = ( value < gravityPropertyRange.max );

        // set slider value
        if ( valuePrecision > 2 ) {
          gravityProperty.value = Util.toFixedNumber( value, PendulumLabConstants.SLIDER_PRECISION );
        }
      } );

      // expand question node
      this.questionNodeBackground.setRectBounds( this.gravityAdjustmentNode.bounds );
      updateQuestionTextPosition( this.questionNodeText, this.gravityAdjustmentNode );
    }
  } );
} );
