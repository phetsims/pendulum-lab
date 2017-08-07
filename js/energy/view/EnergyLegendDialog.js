// Copyright 2017, University of Colorado Boulder

/**
 * Legend dialog for the energy labels
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var Dialog = require( 'JOIST/Dialog' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var energyLegendString = require( 'string!PENDULUM_LAB/energyLegend' );
  var legendKineticEnergyString = require( 'string!PENDULUM_LAB/legend.kineticEnergy' );
  var legendKineticEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.kineticEnergyAbbreviation' );
  var legendPotentialEnergyString = require( 'string!PENDULUM_LAB/legend.potentialEnergy' );
  var legendPotentialEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.potentialEnergyAbbreviation' );
  var legendThermalEnergyString = require( 'string!PENDULUM_LAB/legend.thermalEnergy' );
  var legendThermalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.thermalEnergyAbbreviation' );
  var legendTotalEnergyString = require( 'string!PENDULUM_LAB/legend.totalEnergy' );
  var legendTotalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.totalEnergyAbbreviation' );

  /**
   * @constructor
   */
  function EnergyLegendDialog() {
    var abbreviationGroup = new AlignGroup();
    var descriptionGroup = new AlignGroup();

    var content = new VBox( {
      spacing: 15,
      children: [
        {
          abbreviation: legendKineticEnergyAbbreviationString,
          description: legendKineticEnergyString,
          color: PendulumLabConstants.KINETIC_ENERGY_COLOR
        }, {
          abbreviation: legendPotentialEnergyAbbreviationString,
          description: legendPotentialEnergyString,
          color: PendulumLabConstants.POTENTIAL_ENERGY_COLOR
        }, {
          abbreviation: legendThermalEnergyAbbreviationString,
          description: legendThermalEnergyString,
          color: PendulumLabConstants.THERMAL_ENERGY_COLOR
        }, {
          abbreviation: legendTotalEnergyAbbreviationString,
          description: legendTotalEnergyString,
          color: PendulumLabConstants.TOTAL_ENERGY_COLOR
        },
      ].map( function( itemData ) {
        return new HBox( {
          spacing: 20,
          children: [
            new AlignBox( new RichText( itemData.abbreviation, {
              font: PendulumLabConstants.LEGEND_ABBREVIATION_FONT,
              fill: itemData.color,
              maxWidth: 100
            } ), {
              group: abbreviationGroup,
              xAlign: 'left'
            } ),
            new AlignBox( new Text( itemData.description, {
              font: PendulumLabConstants.LEGEND_DESCRIPTION_FONT
            } ), {
              group: descriptionGroup,
              xAlign: 'left',
              maxWidth: 500
            } )
          ]
        } );
      } )
    } );

    Dialog.call( this, content, {
      modal: true,
      title: new Text( energyLegendString, {
        font: PendulumLabConstants.DIALOG_TITLE_FONT,
        maxWidth: 700
      } ),
      xMargin: 30,
      yMargin: 20
    } );
  }

  pendulumLab.register( 'EnergyLegendDialog', EnergyLegendDialog );

  return inherit( Dialog, EnergyLegendDialog );
} );
