// Copyright 2014-2015, University of Colorado Boulder

/**
 * Period trace timer node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var ABSwitch = require( 'SUN/ABSwitch' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
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
  var pattern0TimeValueTimeUnitsMetricString = require( 'string!PENDULUM_LAB/pattern.0timeValue.timeUnitsMetric' );
  var periodString = require( 'string!PENDULUM_LAB/period' );

  // constants
  var BACKGROUND_IN_COLOR = 'rgb( 245, 217, 73 )';
  var BACKGROUND_OUT_COLOR = 'rgb( 64, 64, 65 )';
  var BUTTON_WIDTH = 40;    // play button width on period timer tool
  var FONT_TEXT = new PhetFont( 14 );
  var FONT_TIME = new PhetFont( 20 );
  var PANEL_PAD = 8;
  var RECT_SIZE = new Dimension2( 15, 20 );  // pendulum icon dimensions
  var TOUCH_PADDING_HORIZONTAL = 5;
  var TOUCH_PADDING_TOP = 5;
  var TOUCH_PADDING_BOTTOM = 7;

  /**
   * @param {PeriodTimer} periodTimer - Period timer
   * @param {Property.<boolean>} secondPendulumIsVisibleProperty - Second pendulum visibility property.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Object} [options]
   * @constructor
   */
  function PeriodTimerNode( periodTimer, secondPendulumIsVisibleProperty, layoutBounds, options ) {
    var self = this;

    options = _.extend( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1'
    }, options );

    Node.call( this, _.extend( { cursor: 'pointer' }, options ) );

    // creates Uturn arrow on the period timer tool
    var uArrowShape = new UTurnArrowShape( 10 );

    // convenience variables for play shape
    var playPauseHeight = uArrowShape.bounds.height;
    var playPauseWidth = playPauseHeight;
    var halfPlayStroke = 0.05 * playPauseWidth;
    var playOffset = 0.15 * playPauseWidth;

    // creates triangle shape on play button by creating three lines at x,y coordinates.
    var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseHeight / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseHeight / 2 + halfPlayStroke + playOffset )
      .close().getOffsetShape( -playOffset );

    // creates playPauseButton
    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( uArrowShape, { fill: options.iconColor, centerX: 0, centerY: 0, pickable: false } ),
      new Path( playShape, {
        pickable: false,
        stroke: options.iconColor,
        fill: '#eef',
        lineWidth: halfPlayStroke * 2,
        centerX: 0,
        centerY: 0
      } ), periodTimer.isRunningProperty, {
        baseColor: options.buttonBaseColor,
        minWidth: BUTTON_WIDTH
      } );

    // increase touch area of playPauseButton
    var buttonBounds = playPauseButton.localBounds;
    playPauseButton.touchArea = new Bounds2( buttonBounds.minX - TOUCH_PADDING_HORIZONTAL,
      buttonBounds.minY - TOUCH_PADDING_TOP,
      buttonBounds.maxX + TOUCH_PADDING_HORIZONTAL,
      buttonBounds.maxY + TOUCH_PADDING_BOTTOM );

    // creates pendulum icon for first pendulum
    var firstPendulumIcon = new Node( {
      children: [ new Rectangle( 0, 0, RECT_SIZE.width, RECT_SIZE.height, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, RECT_SIZE.width, 0 ).addColorStop( 0, PendulumLabConstants.FIRST_PENDULUM_COLOR ).addColorStop( 0.6, PendulumLabConstants.FIRST_PENDULUM_COLOR ).addColorStop( 0.8, 'white' ).addColorStop( 1, PendulumLabConstants.FIRST_PENDULUM_COLOR )
      } ),
        new Text( '1', { fill: 'white', font: FONT_TEXT, centerX: RECT_SIZE.width / 2, centerY: RECT_SIZE.height / 2 } ) ]
    } );

    // creates pendulum icon for second pendulum
    var secondPendulumIcon = new Node( {
      children: [ new Rectangle( 0, 0, RECT_SIZE.width, RECT_SIZE.height, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, RECT_SIZE.width, 0 ).addColorStop( 0, PendulumLabConstants.SECOND_PENDULUM_COLOR ).addColorStop( 0.6, PendulumLabConstants.SECOND_PENDULUM_COLOR ).addColorStop( 0.8, 'white' ).addColorStop( 1, PendulumLabConstants.SECOND_PENDULUM_COLOR )
      } ),
        new Text( '2', { fill: 'white', font: FONT_TEXT, centerX: RECT_SIZE.width / 2, centerY: RECT_SIZE.height / 2 } ) ]
    } );

    // creates switch icon for choosing the first or second pendulum
    var graphUnitsSwitch = new ABSwitch( periodTimer.isFirstProperty, true, firstPendulumIcon, false, secondPendulumIcon, {
      xSpacing: 3,
      switchSize: new Dimension2( 25, 12.5 ),
      thumbTouchAreaXDilation: 3.5,
      thumbTouchAreaYDilation: 3.5,
      setEnabled: null // Do not highlight the selected mass more than the other
    } );

    // indicates touch areas for pendulum icons
    var firstBounds = firstPendulumIcon.localBounds;
    var secondBounds = secondPendulumIcon.localBounds;
    firstPendulumIcon.touchArea = new Bounds2( firstBounds.minX - TOUCH_PADDING_HORIZONTAL,
      firstBounds.minY - TOUCH_PADDING_TOP,
      firstBounds.maxX,
      firstBounds.maxY + TOUCH_PADDING_BOTTOM );
    secondPendulumIcon.touchArea = new Bounds2( secondBounds.minX,
      secondBounds.minY - TOUCH_PADDING_TOP,
      secondBounds.maxX + TOUCH_PADDING_HORIZONTAL,
      secondBounds.maxY + TOUCH_PADDING_BOTTOM );

    // Switch,Play button, and pendulum icon buttons at the bottom of the period timer tool.
    var periodTimerPendulaSelector = new HBox( { spacing: 10, children: [ graphUnitsSwitch, playPauseButton ] } );

    // Creates time text inside period timer tool.
    var readoutText = new Text( getTextTime( 0 ), { font: FONT_TIME, maxWidth: periodTimerPendulaSelector.width * 0.80 } );

    // Creates white background behind the time readout text in period timer tool.
    var textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 20, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );

    // Creates the title, time readout, and period timer pendulum selector as one box in period timer tool.
    var vBox = new VBox( {
      spacing: 5,
      align: 'center',
      left: PANEL_PAD,
      top: PANEL_PAD,

      children: [
        new Text( periodString, { font: FONT_TEXT, pickable: false, maxWidth: periodTimerPendulaSelector.width } ),
        new Node( { children: [ textBackground, readoutText ], pickable: false, maxWidth: periodTimerPendulaSelector.width } ),
        periodTimerPendulaSelector
      ]
    } );

    var backgroundDimension = vBox.bounds.dilated( PANEL_PAD );

    // creates the grey border around the period timer tool.
    this.addChild( new Rectangle( -PANEL_PAD, -PANEL_PAD, backgroundDimension.width + 2 * PANEL_PAD, backgroundDimension.height + 2 * PANEL_PAD, 20, 20, { fill: BACKGROUND_OUT_COLOR } ) );

    // Creates the grey glare on the upper portion of the period timer tool.
    this.addChild( new Node( {
      pickable: false,
      children: [
        // creates top part of the glare
        new Rectangle( 20, -PANEL_PAD, backgroundDimension.width - 30, PANEL_PAD, {
          fill: new LinearGradient( 0, -PANEL_PAD, 0, 0 )
            .addColorStop( 0, 'rgba(0,0,0,0)' )
            .addColorStop( 0.5, 'rgba(255,255,255,0.5)' )
            .addColorStop( 1, 'rgba(0,0,0,0)' )
        } ),
        // creates the curved part of the glare.
        new Path( Shape.ellipse( 9.1, 2, 7, 14, Math.PI / 4 ), {
          fill: new RadialGradient( 20, 28, 28, 20, 28, 36 )
            .addColorStop( 0, 'rgba(0,0,0,0)' )
            .addColorStop( 0.5, 'rgba(255,255,255,0.5)' )
            .addColorStop( 1, 'rgba(0,0,0,0)' )
        } )
      ]
    } ) );

    // creates and adds the yellow background of the period timer.
    this.addChild( new Rectangle( 0, 0, backgroundDimension.width, backgroundDimension.height, 20, 20, {
      fill: BACKGROUND_IN_COLOR,
      pickable: false
    } ) );

    // adds period timer contents on top of yellow background.
    this.addChild( vBox );

    // present for the lifetime of the sim
    periodTimer.elapsedTimeProperty.link( function updateTime( value ) {
      readoutText.text = getTextTime( value );
    } );

    // switch to second pendulum when it visible only
    // present for the lifetime of the sim
    secondPendulumIsVisibleProperty.link( function( isVisible ) {
      graphUnitsSwitch.pickable = isVisible;
      graphUnitsSwitch.opacity = isVisible ? 1 : 0.5;
      if ( !isVisible ) {
        periodTimer.isFirstProperty.value = true;
      }
    } );

    this.movableDragHandler = new MovableDragHandler( periodTimer.locationProperty, {
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 ),
      allowTouchSnag: false
    } );
    // add drag and drop events
    this.addInputListener( this.movableDragHandler );

    var doNotStartDragListener = {
      down: function( event ) {
        event.handle();
      }
    };
    // prevent dragging the PeriodTimer from the playPause Button and graphUnitSwitch
    playPauseButton.addInputListener( doNotStartDragListener );
    graphUnitsSwitch.addInputListener( doNotStartDragListener );

    // add update of node location
    periodTimer.locationProperty.lazyLink( function( location ) {
      // Because location is initialized to be null
      if ( location ) {
        self.center = location;
      }
    } );

    // set visibility observer, present for the lifetime of the sim
    periodTimer.isVisibleProperty.linkAttribute( this, 'visible' );
  }

  pendulumLab.register( 'PeriodTimerNode', PeriodTimerNode );

  /**
   * converts the value of time to a string, appending to it the abbreviation for seconds
   * @param {number} value
   * @returns {string}
   */
  var getTextTime = function( value ) {
    return StringUtils.format( pattern0TimeValueTimeUnitsMetricString, Util.toFixed( value, 4 ) );
  };

  return inherit( Node, PeriodTimerNode );
} );
