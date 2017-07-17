// Copyright 2014-2015, University of Colorado Boulder

/**
 * Arrow control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of velocity and acceleration arrows.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // strings
  var accelerationString = require( 'string!PENDULUM_LAB/acceleration' );
  var velocityString = require( 'string!PENDULUM_LAB/velocity' );

  // constants
  var ARROW_LENGTH = 22;
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var TEXT_MARGIN_RIGHT = 5;
  var PANEL_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;
  var MAX_TEXT_WIDTH = PANEL_WIDTH * 0.60;  // allows for 60% of the horizontal space in the panel for text.

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isVelocityVisibleProperty - Property to control visibility of velocity arrows.
   * @param {Property.<boolean>} isAccelerationVisibleProperty - Property to control visibility of acceleration arrows.
   * @param {Object} [options] for tools control panel node
   */
  function ArrowsPanelNode( isVelocityVisibleProperty, isAccelerationVisibleProperty, options ) {
    options = _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    var labels = [
      new Text( velocityString, { font: PendulumLabConstants.TITLE_FONT, centerY: 0, maxWidth: MAX_TEXT_WIDTH } ),
      new Text( accelerationString, { font: PendulumLabConstants.TITLE_FONT, centerY: 0, maxWidth: MAX_TEXT_WIDTH } )
    ];

    // determine max sting width determined by widths of velocity or acceleration strings
    var maxStringWidth = 0;
    labels.forEach( function( textString ) {
      maxStringWidth = Math.max( maxStringWidth, textString.width );
    } );

    Panel.call( this,
      new Node( {
        children: [
          // necessary to expand panel
          new HStrut( PANEL_WIDTH, { pickable: false } ),

          // Creates check boxes within panel
          new VerticalCheckBoxGroup( [
            {
              content: new Node( {
                pickable: false,
                children: [
                  // adds velocity string to panel
                  labels[ 0 ],
                  // Creates velocity arrow within panel
                  new ArrowNode( maxStringWidth + TEXT_MARGIN_RIGHT, 0, maxStringWidth + TEXT_MARGIN_RIGHT + ARROW_LENGTH, 0, {
                    fill: PendulumLabConstants.VELOCITY_ARROW_COLOR,
                    centerY: 0,
                    tailWidth: ARROW_TAIL_WIDTH,
                    headWidth: ARROW_HEAD_WIDTH
                  } )
                ]
              } ),
              property: isVelocityVisibleProperty
            },
            {
              content: new Node( {
                pickable: false,
                children: [
                  // adds acceleration string to panel
                  labels[ 1 ],
                  // Creates velocity arrow within panel
                  new ArrowNode( maxStringWidth + TEXT_MARGIN_RIGHT, 0, maxStringWidth + TEXT_MARGIN_RIGHT + ARROW_LENGTH, 0, {
                    fill: PendulumLabConstants.ACCELERATION_ARROW_COLOR,
                    centerY: 0,
                    tailWidth: ARROW_TAIL_WIDTH,
                    headWidth: ARROW_HEAD_WIDTH
                  } )
                ]
              } ),
              property: isAccelerationVisibleProperty
            }
          ], {
            spacing: 7,
            boxWidth: labels[ 0 ].height
          } )
        ]
      } ), options );
  }

  pendulumLab.register( 'ArrowsPanelNode', ArrowsPanelNode );

  return inherit( Panel, ArrowsPanelNode );
} );
