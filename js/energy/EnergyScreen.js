// Copyright 2014-2015, University of Colorado Boulder

/**
 * Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var EnergyScreenView = require( 'PENDULUM_LAB/energy/view/EnergyScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

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
      function() { return new EnergyModel(); },
      //TODO magic number
      function( model ) { return new EnergyScreenView( model, 253 ); },
      options
    );
  }

  pendulumLab.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );
