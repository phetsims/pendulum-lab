// Copyright 2014-2023, University of Colorado Boulder

/**
 * Period trace timer node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import { AlignBox, Color, DragListener, HBox, Image, LinearGradient, Node, Path, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import periodTimerBackground_png from '../../../mipmaps/periodTimerBackground_png.js';
import PendulumLabConstants from '../../common/PendulumLabConstants.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';

const periodString = PendulumLabStrings.period;
const secondsPatternString = PendulumLabStrings.secondsPattern;

class PeriodTimerNode extends Node {
  /**
   * @param {PeriodTimer} periodTimer - Period timer
   * @param {Property.<boolean>} secondPendulumIsVisibleProperty - Second pendulum visibility property.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Object} [options]
   */
  constructor( periodTimer, secondPendulumIsVisibleProperty, layoutBounds, options ) {

    options = merge( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      cursor: 'pointer'
    }, options );

    super( options );

    // creates Uturn arrow on the period timer tool
    const uArrowShape = new UTurnArrowShape( 10 );

    // creates triangle shape on play button by creating three lines at x,y coordinates.
    const playPauseSize = uArrowShape.bounds.height;
    const halfPlayStroke = 0.05 * playPauseSize;
    const playOffset = 0.15 * playPauseSize;
    const playShape = new Shape().moveTo( playPauseSize - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseSize / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseSize / 2 + halfPlayStroke + playOffset )
      .close()
      .getOffsetShape( -playOffset );

    // creates playPauseButton
    const playPauseButton = new BooleanRectangularToggleButton( periodTimer.isRunningProperty, new Path( uArrowShape, {
      fill: options.iconColor,
      center: Vector2.ZERO,
      pickable: false
    } ), new Path( playShape, {
      pickable: false,
      stroke: options.iconColor,
      fill: '#eef',
      lineWidth: halfPlayStroke * 2,
      center: Vector2.ZERO
    } ), {
      baseColor: options.buttonBaseColor,
      minWidth: 40
    } );
    playPauseButton.touchArea = playPauseButton.localBounds.dilated( 5 );

    function createPendulumIcon( color, label, padLeft ) {
      const highlightColor = Color.toColor( color ).colorUtilsBrighter( 0.4 );
      const rectBounds = new Bounds2( 0, 0, 17, 20 );
      const icon = new Node( {
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
      const touchArea = icon.localBounds.dilated( 5 );
      if ( padLeft ) {
        touchArea.maxX = icon.localBounds.maxX;
      }
      else {
        touchArea.minX = icon.localBounds.minX;
      }
      icon.touchArea = touchArea;
      return icon;
    }

    const firstPendulumIcon = createPendulumIcon( PendulumLabConstants.FIRST_PENDULUM_COLOR, '1', true );
    const secondPendulumIcon = createPendulumIcon( PendulumLabConstants.SECOND_PENDULUM_COLOR, '2', false );

    // creates switch icon for choosing the first or second pendulum
    const graphUnitsSwitch = new ABSwitch( periodTimer.activePendulumIndexProperty, 0, firstPendulumIcon, 1, secondPendulumIcon, {
      spacing: 3,
      setEnabled: null, // Do not highlight the selected mass more than the other
      toggleSwitchOptions: {
        size: new Dimension2( 25, 12.5 ),
        thumbTouchAreaXDilation: 3.5,
        thumbTouchAreaYDilation: 3.5
      }
    } );

    // Switch,Play button, and pendulum icon buttons at the bottom of the period timer tool.
    const periodTimerPendulaSelector = new HBox( {
      spacing: 10,
      children: [ graphUnitsSwitch, playPauseButton ]
    } );

    // Creates time text inside period timer tool.
    const readoutText = new Text( '', {
      font: PendulumLabConstants.PERIOD_TIMER_READOUT_FONT,
      maxWidth: periodTimerPendulaSelector.width * 0.80
    } );
    // present for the lifetime of the sim
    periodTimer.elapsedTimeProperty.link( value => {
      readoutText.string = StringUtils.fillIn( secondsPatternString, {
        seconds: Utils.toFixed( value, 4 )
      } );
    } );

    // Creates white background behind the time readout text in period timer tool.
    const textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 20, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );

    // Creates the title, time readout, and period timer pendulum selector as one box in period timer tool.
    const vBox = new VBox( {
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
    const background = new Image( periodTimerBackground_png, {
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
    secondPendulumIsVisibleProperty.link( isVisible => {
      periodTimerPendulaSelector.children = isVisible ? [ graphUnitsSwitch, playPauseButton ] : [ playPauseButton ];
      if ( !isVisible ) {
        periodTimer.activePendulumIndexProperty.value = 0;
      }
    } );

    this.dragListener = new DragListener( {
      positionProperty: periodTimer.positionProperty,
      useParentOffset: true,
      dragBoundsProperty: new Property( layoutBounds.erodedXY( this.width / 2, this.height / 2 ) ),
      allowTouchSnag: false
    } );
    // add drag and drop events
    this.addInputListener( this.dragListener );

    // prevent dragging the PeriodTimer from the playPause Button and graphUnitSwitch
    const doNotStartDragListener = {
      down: event => {
        event.handle();
      }
    };
    playPauseButton.addInputListener( doNotStartDragListener );
    graphUnitsSwitch.addInputListener( doNotStartDragListener );

    // add update of node position
    periodTimer.positionProperty.lazyLink( position => {
      // Because position is initialized to be null
      if ( position ) {
        this.center = position;
      }
    } );

    // set visibility observer, present for the lifetime of the sim
    periodTimer.isVisibleProperty.linkAttribute( this, 'visible' );
  }
}

pendulumLab.register( 'PeriodTimerNode', PeriodTimerNode );

export default PeriodTimerNode;
