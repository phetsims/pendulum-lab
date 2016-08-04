// Copyright 2013-2015, University of Colorado Boulder

/**
 * The Clear Thermal button that can be used to remove thermal energy from the system.
 * Looks like a trash can with an orange arrow going into it.
 * It appears in the bar chart and is disabled if there is no thermal energy in the system.
 *
 * @author Sam Reid
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );

  // images
  var trashCanImage = require( 'image!PENDULUM_LAB/trash-can.png' );
  var trashCanGrayImage = require( 'image!PENDULUM_LAB/trash-can-disabled.png' );

  /**
   * @param {Property.<number>} thermalEnergyProperty
   * @param {Object} [options]
   * @constructor
   */
  function ClearThermalButton( thermalEnergyProperty, options ) {
    var clearThermalButton = this;
    options = _.extend( {
      cursor: 'pointer'
    }, options );

    var icon = new Image( trashCanImage, { scale: 0.22 } );

    RectangularPushButton.call( this, {
      content: icon,
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      cornerRadius: 6,
      listener: function() {
        thermalEnergyProperty.reset();
      },
      buttonAppearanceStrategy: RectangularButtonView.flatAppearanceStrategy,
      xMargin: 7,
      yMargin: 3
    } );

    this.mouseArea = this.bounds.dilated( 5 );
    this.mutate( options );

    thermalEnergyProperty.link( function( thermalEnergy ) {
      var allowClearingThermalEnergy = (thermalEnergy !== 0 );
      icon.image = allowClearingThermalEnergy ? trashCanImage : trashCanGrayImage;
      icon.opacity = allowClearingThermalEnergy ? 1 : 0.3;
      clearThermalButton.pickable = allowClearingThermalEnergy;
      clearThermalButton.enabled = allowClearingThermalEnergy;
    } );

  }

  pendulumLab.register( 'ClearThermalButton', ClearThermalButton );

  return inherit( RectangularPushButton, ClearThermalButton );
} );
