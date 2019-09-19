// Copyright 2014-2017, University of Colorado Boulder

/**
 * Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  const EnergyScreenView = require( 'PENDULUM_LAB/energy/view/EnergyScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenEnergyString = require( 'string!PENDULUM_LAB/screen.energy' );

  // images
  const energyImage = require( 'mipmap!PENDULUM_LAB/energy-screen-icon.png' );

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
      function() { return new EnergyModel(); },
      function( model ) { return new EnergyScreenView( model ); },
      options
    );
  }

  pendulumLab.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );
