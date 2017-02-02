// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenEnergyString = require( 'string!PENDULUM_LAB/screen.energy' );

  // images
  var energyImage = require( 'mipmap!PENDULUM_LAB/energy-screen-icon.png' );

  /**
   * @constructor
   */
  function EnergyScreen() {

    var options = {
      name: screenEnergyString,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new Image( energyImage )
    };

    Screen.call( this,
      function() { return new EnergyModel( true ); },
      //TODO magic number
      function( model ) { return new EnergyView( model, PendulumLabConstants.MODEL_VIEW_TRANSFORM, 253 ); },
      options
    );
  }

  pendulumLab.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );
