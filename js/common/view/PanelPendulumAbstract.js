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

  // constants
  var CORNER_RADIUS = 5;
  var MARGIN = 10;
  var PANEL_BACKGROUND_COLOR = 'rgb( 216, 251, 196 )';

  /**
   * @param {Node} content node
   * @param {Object} [options]
   * @constructor
   */
  function PanelPendulumAbstract( content, options ) {
    Panel.call( this, content, _.extend( {
      cornerRadius: CORNER_RADIUS,
      fill: PANEL_BACKGROUND_COLOR,
      xMargin: MARGIN,
      yMargin: MARGIN
    }, options ) );
  }

  return inherit( Panel, PanelPendulumAbstract );
} );