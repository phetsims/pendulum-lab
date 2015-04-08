// Copyright 2002-2014, University of Colorado Boulder

/**
 * Abstract class for panels in 'Pendulum Lab' simulation.
 * Set common options for all panels.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );

  /**
   * @param {Node} content node
   * @param {Object} [options]
   * @constructor
   */
  function PanelPendulumAbstract( content, options ) {
    Panel.call( this, content, _.extend( {
      cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS,
      fill: PendulumLabConstants.PANEL_BACKGROUND_COLOR,
      xMargin: PendulumLabConstants.PANEL_MARGIN,
      yMargin: PendulumLabConstants.PANEL_MARGIN
    }, options ) );
  }

  return inherit( Panel, PanelPendulumAbstract );
} );