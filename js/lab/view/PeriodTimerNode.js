// Copyright 2014-2017, University of Colorado Boulder

/**
 * Period trace timer node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var periodString = require( 'string!PENDULUM_LAB/period' );
  var secondsPatternString = require( 'string!PENDULUM_LAB/secondsPattern' );

  var periodTimerBackgroundImage = require( 'mipmap!PENDULUM_LAB/period-timer-background.png' );

  /**
   * @constructor
   *
   * @param {PeriodTimer} periodTimer - Period timer
   * @param {Property.<boolean>} secondPendulumIsVisibleProperty - Second pendulum visibility property.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Object} [options]
   */
  function PeriodTimerNode( periodTimer, secondPendulumIsVisibleProperty, layoutBounds, options ) {
    var self = this;

    options = _.extend( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      cursor: 'pointer'
    }, options );

    Node.call( this, options );

    // creates Uturn arrow on the period timer tool
    var uArrowShape = new UTurnArrowShape( 10 );

    // creates triangle shape on play button by creating three lines at x,y coordinates.
    var playPauseSize = uArrowShape.bounds.height;
    var halfPlayStroke = 0.05 * playPauseSize;
    var playOffset = 0.15 * playPauseSize;
    var playShape = new Shape().moveTo( playPauseSize - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseSize / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseSize / 2 + halfPlayStroke + playOffset )
      .close().getOffsetShape( -playOffset );

    // creates playPauseButton
    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( uArrowShape, {
        fill: options.iconColor,
        center: Vector2.ZERO,
        pickable: false
      } ),
      new Path( playShape, {
        pickable: false,
        stroke: options.iconColor,
        fill: '#eef',
        lineWidth: halfPlayStroke * 2,
        center: Vector2.ZERO
      } ), periodTimer.isRunningProperty, {
        baseColor: options.buttonBaseColor,
        minWidth: 40
      } );
    playPauseButton.touchArea = playPauseButton.localBounds.dilated( 5 );

    function createPendulumIcon( color, label, padLeft ) {
      var highlightColor = Color.toColor( color ).colorUtilsBrighter( 0.4 );
      var rectBounds = new Bounds2( 0, 0, 17, 20 );
      var icon = new Node( {
        children: [
          Rectangle.bounds( rectBounds, {
            stroke: 'black',
            lineWidth: 0.5,
            fill: new LinearGradient( 0, 0, rectBounds.width, 0 ).addColorStop( 0, color )
                                                                .addColorStop( 0.2, highlightColor )
                                                                .addColorStop( 0.4, color )
                                                                .addColorStop( 1, color )
          } ),
          new Text( label, {
            fill: 'white',
            font: new PhetFont( 14 ),
            center: rectBounds.center
          } )
        ]
      } );

      // Don't pad next to the AB switch, but only away from it
      var touchArea = icon.localBounds.dilated( 5 );
      if ( padLeft ) {
        touchArea.maxX = icon.localBounds.maxX;
      }
      else {
        touchArea.minX = icon.localBounds.minX;
      }
      icon.touchArea = touchArea;
      return icon;
    }

    var firstPendulumIcon = createPendulumIcon( PendulumLabConstants.FIRST_PENDULUM_COLOR, '1', true );
    var secondPendulumIcon = createPendulumIcon( PendulumLabConstants.SECOND_PENDULUM_COLOR, '2', false );

    // creates switch icon for choosing the first or second pendulum
    var graphUnitsSwitch = new ABSwitch( periodTimer.activePendulumIndexProperty, 0, firstPendulumIcon, 1, secondPendulumIcon, {
      xSpacing: 3,
      switchSize: new Dimension2( 25, 12.5 ),
      thumbTouchAreaXDilation: 3.5,
      thumbTouchAreaYDilation: 3.5,
      setEnabled: null // Do not highlight the selected mass more than the other
    } );

    // Switch,Play button, and pendulum icon buttons at the bottom of the period timer tool.
    var periodTimerPendulaSelector = new HBox( {
      spacing: 10,
      children: [ graphUnitsSwitch, playPauseButton ]
    } );

    // Creates time text inside period timer tool.
    var readoutText = new Text( '', {
      font: PendulumLabConstants.PERIOD_TIMER_READOUT_FONT,
      maxWidth: periodTimerPendulaSelector.width * 0.80
    } );
    // present for the lifetime of the sim
    periodTimer.elapsedTimeProperty.link( function updateTime( value ) {
      readoutText.text =  StringUtils.fillIn( secondsPatternString, {
        seconds: Util.toFixed( value, 4 )
      } );
    } );

    // Creates white background behind the time readout text in period timer tool.
    var textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 20, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );

    // Creates the title, time readout, and period timer pendulum selector as one box in period timer tool.
    var vBox = new VBox( {
      spacing: 5,
      align: 'center',
      children: [
        new Text( periodString, {
          font: PendulumLabConstants.PERIOD_TIMER_TITLE_FONT,
          pickable: false,
          maxWidth: periodTimerPendulaSelector.width
        } ),
        new Node( {
          children: [ textBackground, readoutText ],
          pickable: false,
          maxWidth: periodTimerPendulaSelector.width
        } ),
        periodTimerPendulaSelector
      ]
    } );

    // background image
    var background = new Image( periodTimerBackgroundImage, {
      scale: 0.6,
      center: vBox.center
    } );
    this.addChild( background );

    // adds period timer contents on top of yellow background.
    this.addChild( new AlignBox( vBox, {
      alignBounds: background.bounds
    } ) );

    // switch to second pendulum when it visible only
    // present for the lifetime of the sim
    secondPendulumIsVisibleProperty.link( function( isVisible ) {
      periodTimerPendulaSelector.children = isVisible ? [ graphUnitsSwitch, playPauseButton ] : [ playPauseButton ];
      if ( !isVisible ) {
        periodTimer.activePendulumIndexProperty.value = 0;
      }
    } );

    this.movableDragHandler = new MovableDragHandler( periodTimer.locationProperty, {
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 ),
      allowTouchSnag: false
    } );
    // add drag and drop events
    this.addInputListener( this.movableDragHandler );

    // prevent dragging the PeriodTimer from the playPause Button and graphUnitSwitch
    var doNotStartDragListener = {
      down: function( event ) {
        event.handle();
      }
    };
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

  return inherit( Node, PeriodTimerNode );
} );
