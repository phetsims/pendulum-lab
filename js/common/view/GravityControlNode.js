// Copyright 2014-2015, University of Colorado Boulder

/**
 * Gravity slider and body list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );
  var gravitationalAccelerationPatternString = require( 'string!PENDULUM_LAB/gravitationalAccelerationPattern' );
  var whatIsTheValueOfGravityString = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  // constants
  var TWEAKERS_STEP = Math.pow( 10, -PendulumLabConstants.TWEAKERS_PRECISION );
  var VALUE_LABEL_SPACING = 4;

  /**
   * @constructor
   *
   * @param {Property.<number>} gravityProperty - Property to update by slider.
   * @param {Range} gravityRange - Range of gravity property.
   * @param {Property.<Body>} bodyProperty - Property to update by combo box.
   * @param {Node} popupLayer
   * @param {Object} [options]
   */
  function GravityControlNode( gravityProperty, gravityRange, bodyProperty, popupLayer, options ) {
    var self = this;
    var container = new Node();

    VBox.call( this, _.extend( { spacing: 3 }, options ) );
    this.gravityAdjustmentNode = new VBox( { spacing: VALUE_LABEL_SPACING } );

    var comboBoxItems = Body.BODIES.map( function( body ) {
      return {
        node: new Text( body.title, {
          font: PendulumLabConstants.GRAVITY_COMBO_FONT,
          maxWidth: 50
        } ),
        value: body
      };
    } );

    // add body menu combo box
    this.addChild( new ComboBox( comboBoxItems, bodyProperty, popupLayer, {
      listPosition: 'above',
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 3
    } ) );

    // create slider for gravity property
    var slider = new HSlider( gravityProperty, gravityRange, {
      majorTickLength: 10,
      trackSize: PendulumLabConstants.GLOBAL_TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE,
      thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
      thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF'
    } );

    // we want two major ticks one at the beginning and the other at the end
    slider.addMajorTick( gravityRange.min, new Text( noneString, {
      font: PendulumLabConstants.TICK_FONT,
      pickable: false,
      maxWidth: PendulumLabConstants.TICK_LABEL_MAX_WIDTH
    } ) );
    slider.addMajorTick( gravityRange.max, new Text( lotsString, {
      font: PendulumLabConstants.TICK_FONT,
      pickable: false,
      maxWidth: PendulumLabConstants.TICK_LABEL_MAX_WIDTH
    } ) );
    container.addChild( this.gravityAdjustmentNode );
    this.gravityAdjustmentNode.addChild( slider );

    // create question text node instead of slider for planet X
    this.questionNodeBackground = Rectangle.bounds( this.gravityAdjustmentNode.bounds );
    this.questionNodeText = new Text( whatIsTheValueOfGravityString, { font: PendulumLabConstants.VALUE_OF_GRAVITY_FONT, maxWidth: 150 } );
    this.questionNode = new Node( { children: [ this.questionNodeBackground, this.questionNodeText ], pickable: false } );
    updateQuestionTextPosition( this.questionNodeText, this.gravityAdjustmentNode );
    container.addChild( this.questionNode );

    // if planet X is chosen then replace the slider with a question
    bodyProperty.link( function( body ) {
      if ( body === Body.PLANET_X ) {
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

  pendulumLab.register( 'GravityControlNode', GravityControlNode );

  var updateQuestionTextPosition = function( questionNodeText, gravityAdjustmentNode ) {
    questionNodeText.centerX = gravityAdjustmentNode.bounds.minX + gravityAdjustmentNode.width / 2;
    questionNodeText.centerY = gravityAdjustmentNode.bounds.minY + gravityAdjustmentNode.height / 2;
  };

  return inherit( VBox, GravityControlNode, {
    /**
     * function that will add the value panel and the buttons to change the gravity one tick at a time
     * @param {Property} gravityProperty - the gravity value
     * @param {Range} gravityRange - the range gravity can change
     */
    addTweakers: function( gravityProperty, gravityRange ) {
      // create minus button
      var arrowButtonMinus = new ArrowButton( 'left', function() {
        gravityProperty.value = Util.toFixedNumber( Math.max( gravityRange.min, gravityProperty.value - TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
      }, { scale: 0.5 } );

      // width of the background box
      var labelBackgroundWidth = PendulumLabConstants.GLOBAL_TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING;

      // create value label
      var labelString = StringUtils.fillIn( gravitationalAccelerationPatternString, {
        gravity: Util.toFixed( gravityProperty.value, PendulumLabConstants.TWEAKERS_PRECISION )
      } );
      var valueLabel = new RichText( labelString, {
        centerX: 0,
        centerY: -1,
        font: PendulumLabConstants.READOUT_FONT,
        maxWidth: labelBackgroundWidth - 6 // the label has to be smaller than the box
      } );

      // create plus button
      var arrowButtonPlus = new ArrowButton( 'right', function() {
        gravityProperty.value = Util.toFixedNumber( Math.min( gravityRange.max, gravityProperty.value + TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
      }, { scale: 0.5 } );

      var hbox = new HBox( {
        spacing: VALUE_LABEL_SPACING, children: [
          arrowButtonMinus,
          new Node( {
            pickable: false,
            children: [
              new Rectangle( 0, 0, PendulumLabConstants.GLOBAL_TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING, arrowButtonMinus.height, 3, 3, {
                centerY: -1,
                centerX: 0,
                fill: '#FFF',
                stroke: 'black'
              } ),
              valueLabel
            ]
          } ),
          arrowButtonPlus
        ]
      } );

      this.gravityAdjustmentNode.insertChild( 0, new AlignBox( hbox, {
        yMargin: 5
      } ) );

      // update the gravity text when the property changes
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

        valueLabel.text = StringUtils.fillIn( gravitationalAccelerationPatternString, {
          gravity: Util.toFixed( value, PendulumLabConstants.TWEAKERS_PRECISION )
        } );
        arrowButtonMinus.enabled = ( value > gravityRange.min );
        arrowButtonPlus.enabled = ( value < gravityRange.max );

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
