// Copyright 2002-2014, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  var LINE_LENGTH_DEFAULT = 3;
  var PENDULUM_TICK_LENGTH = 12;
  var RADIUS = 87;
  var TICK_5_LENGTH = 6;
  var TICK_10_LENGTH = 9;

  /**
   * @param {Array} pendulumModels - Array of pendulum models
   * @param {Object} options for protractor node
   * @constructor
   */
  function ProtractorNode( pendulumModels, options ) {
    var self = this;

    Node.call( this, options );

    // add background ticks
    for ( var currentAngleDeg = 0, currentAngleRad, lineLength, x1, y1, x2, y2; currentAngleDeg <= 180; currentAngleDeg += 1 ) {
      currentAngleRad = currentAngleDeg * Math.PI / 180;

      if ( currentAngleDeg % 10 === 0 ) {
        lineLength = TICK_10_LENGTH;
      }
      else if ( currentAngleDeg % 5 === 0 ) {
        lineLength = TICK_5_LENGTH;
      }
      else {
        lineLength = LINE_LENGTH_DEFAULT;
      }

      x1 = RADIUS * Math.cos( currentAngleRad );
      y1 = RADIUS * Math.sin( currentAngleRad );

      x2 = (RADIUS + lineLength) * Math.cos( currentAngleRad );
      y2 = (RADIUS + lineLength) * Math.sin( currentAngleRad );

      this.addChild( new Line( x1, y1, x2, y2, {stroke: 'black'} ) );
    }

    // add ticks for pendulum
    pendulumModels.forEach( function( pendulumModel ) {
      var tickNodeLeft = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, {stroke: pendulumModel.color, lineWidth: 2} );
      var tickNodeRight = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, {stroke: pendulumModel.color, lineWidth: 2} );
      self.insertChild( 1, tickNodeLeft );
      self.insertChild( 1, tickNodeRight );

      // update tick position
      pendulumModel.property( 'angle' ).link( function( angle ) {
        tickNodeLeft.setRotation( Math.PI / 2 - angle  );
        tickNodeRight.setRotation( Math.PI / 2 + angle  );
      } );

      // set visibility observer
      pendulumModel.property( 'isTickVisible' ).linkAttribute( tickNodeLeft, 'visible' );
      pendulumModel.property( 'isTickVisible' ).linkAttribute( tickNodeRight, 'visible' );
    } );
  }

  return inherit( Node, ProtractorNode );
} );