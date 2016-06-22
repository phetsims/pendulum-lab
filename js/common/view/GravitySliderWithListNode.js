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
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
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
  var pattern0GravityValueGravityUnitsMetricString = require( 'string!PENDULUM_LAB/pattern.0gravityValue.gravityUnitsMetric' );
  var whatIsTheValueOfGravityString = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  // constants
  var FONT = new PhetFont( 9 );
  var FONT_LIST = new PhetFont( 12 );
  var TWEAKERS_STEP = Math.pow( 10, -PendulumLabConstants.TWEAKERS_PRECISION );
  var VALUE_LABEL_SPACING = 4;

  /**
   * Constructor for the gravity slider control.
   *
   * @param {Property.<number>} gravityProperty - Property to update by slider.
   * @param {Range} gravityRange - Range of gravity property.
   * @param {Property.<Body>} bodyProperty - Property to update by combo box.
   * @param {Array.<Body>} bodies - Models of all bodies.
   * @param {Node} bodiesListNode - Node for displaying body list. Should be above all other nodes.
   * @param {Object} [options]
   * @constructor
   */
  function GravitySliderWithListNode( gravityProperty, gravityRange, bodyProperty, bodies, bodiesListNode, options ) {
    var self = this;
    var container = new Node();

    VBox.call( this, _.extend( { spacing: 2 }, options ) );
    this.gravityAdjustmentNode = new VBox( { spacing: VALUE_LABEL_SPACING } );

    // create body list menu
    var bodyListItems = [];
    bodies.forEach( function( body ) {
      var bodyLabel = new Text( body.title, { font: FONT_LIST } );
      bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body
      } );
    } );

    // add body menu combo box
    bodiesListNode.scale( 1.2 );
    this.addChild( new ComboBox( bodyListItems, bodyProperty, bodiesListNode, {
      listPosition: 'above',
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 8
    } ) );

    // create slider for gravity property
    var hSlider = new HSlider( gravityProperty, gravityRange, {
      majorTickLength: 10,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE,
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF'
    } );

    var hBox = new HBox( {
      resize: false,
      children: [
        // needed to prevent wiggle of the slider
        new HStrut( PendulumLabConstants.THUMB_SIZE.width / 2 ),

        hSlider,

        // needed to prevent wiggle of the slider
        new HStrut( PendulumLabConstants.THUMB_SIZE.width / 2 )
      ]
    } );

    // we want two major ticks one at the beginning and the other at the end
    hSlider.addMajorTick( gravityRange.min, new Text( noneString, { font: FONT, pickable: false } ) );
    hSlider.addMajorTick( gravityRange.max, new Text( lotsString, { font: FONT, pickable: false } ) );
    container.addChild( this.gravityAdjustmentNode );
    this.gravityAdjustmentNode.addChild( hBox );

    // create question text node instead of slider for planet X
    this.questionNodeBackground = Rectangle.bounds( this.gravityAdjustmentNode.bounds );
    this.questionNodeText = new Text( whatIsTheValueOfGravityString, { font: FONT, maxWidth: 150 } );
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

  pendulumLab.register( 'GravitySliderWithListNode', GravitySliderWithListNode );

  var updateQuestionTextPosition = function( questionNodeText, gravityAdjustmentNode ) {
    questionNodeText.centerX = gravityAdjustmentNode.bounds.minX + gravityAdjustmentNode.width / 2;
    questionNodeText.centerY = gravityAdjustmentNode.bounds.minY + gravityAdjustmentNode.height / 2;
  };

  return inherit( VBox, GravitySliderWithListNode, {
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
      var labelBackgroundWidth = PendulumLabConstants.TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING;

      // create value label
      var valueLabel = new SubSupText( StringUtils.format( pattern0GravityValueGravityUnitsMetricString, Util.toFixed( gravityProperty.value, PendulumLabConstants.TWEAKERS_PRECISION ) ), {
          centerX: 0,
          centerY: -1,
          font: FONT,
          maxWidth: labelBackgroundWidth - 6 // the label has to be smaller than the box
        } )
        ;

      // create plus button
      var arrowButtonPlus = new ArrowButton( 'right', function() {
        gravityProperty.value = Util.toFixedNumber( Math.min( gravityRange.max, gravityProperty.value + TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
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

        valueLabel.text = StringUtils.format( pattern0GravityValueGravityUnitsMetricString, Util.toFixed( value, PendulumLabConstants.TWEAKERS_PRECISION ) );
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
