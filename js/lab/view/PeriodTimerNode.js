// Copyright 2002-2014, University of Colorado Boulder

/**
 * Period trace timer node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern_0timeValue_timeUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0timeValue.timeUnitsMetric' );
  var PeriodString = require( 'string!PENDULUM_LAB/period' );

  // constants
  var BACKGROUND_IN_COLOR = 'rgb( 245, 217, 73 )';
  var BACKGROUND_OUT_COLOR = 'rgb( 64, 64, 65 )';
  var BUTTON_WIDTH = 40;
  var FONT_TEXT = new PhetFont( 14 );
  var FONT_TIME = new PhetFont( 20 );
  var PANEL_PAD = 8;
  var RECT_SIZE = new Dimension2( 15, 20 );
  var TOUCH_AREA_EXPAND_X = 10;
  var TOUCH_AREA_EXPAND_Y = 3;

  /**
   * @param {PropertySet} periodTraceModel - Period trace model.
   * @param {PropertySet} secondPendulumIsVisibleProperty - Second pendulum visibility property.
   * @param {ModelViewTransform2} mvt
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Object} [options]
   * @constructor
   */
  function PeriodTimerNode( periodTraceModel, secondPendulumIsVisibleProperty, mvt, layoutBounds, options ) {
    var self = this;

    options = _.extend( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1'
    }, options );

    Node.call( this, _.extend( { cursor: 'pointer' }, options ) );

    var readoutText = new Text( getTextTime( 0 ), { font: FONT_TIME } ),
      textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 20, 2 ), 5, 5, {
        fill: '#fff',
        stroke: 'rgba(0,0,0,0.5)'
      } );

    var uArrowShape = new UTurnArrowShape( 10 );
    var playPauseHeight = uArrowShape.computeBounds().height;
    var playPauseWidth = playPauseHeight;
    var halfPlayStroke = 0.05 * playPauseWidth;
    var playOffset = 0.15 * playPauseWidth;
    var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseHeight / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseHeight / 2 + halfPlayStroke + playOffset )
      .close().getOffsetShape( -playOffset );

    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( uArrowShape, { fill: options.iconColor, centerX: 0, centerY: 0 } ),
      new Path( playShape, {
        stroke: options.iconColor,
        fill: '#eef',
        lineWidth: halfPlayStroke * 2,
        centerX: 0,
        centerY: 0
      } ), periodTraceModel.property( 'isRunning' ), {
        baseColor: options.buttonBaseColor,
        minWidth: BUTTON_WIDTH
      } );

    var firstPendulumIcon = new Node( {
      children: [ new Rectangle( 0, 0, RECT_SIZE.width, RECT_SIZE.height, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, RECT_SIZE.width, 0 ).
          addColorStop( 0, PendulumLabConstants.FIRST_PENDULUM_COLOR ).
          addColorStop( 0.6, PendulumLabConstants.FIRST_PENDULUM_COLOR ).
          addColorStop( 0.8, 'white' ).
          addColorStop( 1, PendulumLabConstants.FIRST_PENDULUM_COLOR )
      } ),
        new Text( '1', { fill: 'white', font: FONT_TEXT, centerX: RECT_SIZE.width / 2, centerY: RECT_SIZE.height / 2 } ) ]
    } );
    var secondPendulumIcon = new Node( {
      children: [ new Rectangle( 0, 0, RECT_SIZE.width, RECT_SIZE.height, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, RECT_SIZE.width, 0 ).
          addColorStop( 0, PendulumLabConstants.SECOND_PENDULUM_COLOR ).
          addColorStop( 0.6, PendulumLabConstants.SECOND_PENDULUM_COLOR ).
          addColorStop( 0.8, 'white' ).
          addColorStop( 1, PendulumLabConstants.SECOND_PENDULUM_COLOR )
      } ),
        new Text( '2', { fill: 'white', font: FONT_TEXT, centerX: RECT_SIZE.width / 2, centerY: RECT_SIZE.height / 2 } ) ]
    } );
    var graphUnitsSwitch = new ABSwitch( periodTraceModel.property( 'isFirst' ), true, firstPendulumIcon, false, secondPendulumIcon, {
      xSpacing: 3,
      switchSize: new Dimension2( 25, 12.5 ),
      setEnabled: function() {}
    } );
    expandTouchArea( firstPendulumIcon );
    expandTouchArea( secondPendulumIcon );

    var vBox = new VBox( {
      spacing: 5,
      align: 'center',
      left: PANEL_PAD,
      top: PANEL_PAD,
      children: [
        new Text( PeriodString, { font: FONT_TEXT } ),
        new Node( { children: [ textBackground, readoutText ] } ),
        new HBox( { spacing: 10, children: [ graphUnitsSwitch, playPauseButton ] } )
      ]
    } );

    var backgroundDimension = vBox.bounds.dilated( PANEL_PAD );
    this.addChild( new Rectangle( -PANEL_PAD, -PANEL_PAD, backgroundDimension.width + 2 * PANEL_PAD, backgroundDimension.height + 2 * PANEL_PAD, 20, 20, { fill: BACKGROUND_OUT_COLOR } ) );

    // highlight
    this.addChild( new Node( {
      children: [
        new Rectangle( 20, -PANEL_PAD, backgroundDimension.width - 30, PANEL_PAD, {
          fill: new LinearGradient( 0, -PANEL_PAD, 0, 0 )
            .addColorStop( 0, 'rgba(0,0,0,0)' )
            .addColorStop( 0.5, 'rgba(255,255,255,0.5)' )
            .addColorStop( 1, 'rgba(0,0,0,0)' )
        } ),
        new Path( Shape.ellipse( 9.1, 2, 7, 14, Math.PI / 4 ), {
          fill: new RadialGradient( 20, 28, 28, 20, 28, 36 )
            .addColorStop( 0, 'rgba(0,0,0,0)' )
            .addColorStop( 0.5, 'rgba(255,255,255,0.5)' )
            .addColorStop( 1, 'rgba(0,0,0,0)' )
        } )
      ]
    } ) );

    this.addChild( new Rectangle( 0, 0, backgroundDimension.width, backgroundDimension.height, 20, 20, { fill: BACKGROUND_IN_COLOR } ) );
    this.addChild( vBox );

    periodTraceModel.property( 'elapsedTime' ).link( function updateTime( value ) {
      readoutText.text = getTextTime( value );
    } );

    // switch to second pendulum when it visible only
    secondPendulumIsVisibleProperty.link( function( isVisible ) {
      graphUnitsSwitch.pickable = isVisible;
      if ( !isVisible ) {
        periodTraceModel.isFirst = true;
      }
    } );

    // add drag and drop events
    this.addInputListener( new MovableDragHandler( {
      locationProperty: periodTraceModel.property( 'location' ),
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    }, mvt ) );

    // add update of node location
    periodTraceModel.property( 'location' ).lazyLink( function( location ) {
      self.center = location;
    } );

    // set visibility observer
    periodTraceModel.property( 'isVisible' ).linkAttribute( this, 'visible' );
  }

  // uniformly expands touch area for controls
  var expandTouchArea = function( node ) {
    node.touchArea = node.localBounds.dilatedXY( TOUCH_AREA_EXPAND_X, TOUCH_AREA_EXPAND_Y );
  };

  var getTextTime = function( value ) {
    return StringUtils.format( pattern_0timeValue_timeUnitsMetric, Util.toFixed( value, 4 ) );
  };

  return inherit( Node, PeriodTimerNode );
} );
