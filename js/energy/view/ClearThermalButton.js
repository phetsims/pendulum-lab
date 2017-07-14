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
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  //TODO: reduce duplication
  var trashCanImage = require( 'image!PENDULUM_LAB/trash-can.png' );
  var trashCanGrayImage = require( 'image!PENDULUM_LAB/trash-can-disabled.png' );

  /**
   * @constructor
   *
   * @param {Property.<number>} thermalEnergyProperty
   * @param {Object} [options]
   */
  function ClearThermalButton( thermalEnergyProperty, options ) {
    var self = this;
    options = _.extend( {
      cursor: 'pointer'
    }, options );

    var icon = new Image( trashCanImage, { scale: 0.16 } );

    RectangularPushButton.call( this, {
      content: icon,
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      cornerRadius: 4,
      listener: function() {
        thermalEnergyProperty.reset();
      },
      buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
      xMargin: 5,
      yMargin: 2
    } );

    this.touchArea = this.bounds.dilated( 5 );
    this.mutate( options );

    thermalEnergyProperty.link( function( thermalEnergy ) {
      var allowClearingThermalEnergy = ( thermalEnergy !== 0 );
      icon.image = allowClearingThermalEnergy ? trashCanImage : trashCanGrayImage;
      icon.opacity = allowClearingThermalEnergy ? 1 : 0.3;
      self.pickable = allowClearingThermalEnergy;
      self.enabled = allowClearingThermalEnergy;
    } );

  }

  pendulumLab.register( 'ClearThermalButton', ClearThermalButton );

  return inherit( RectangularPushButton, ClearThermalButton );
} );
