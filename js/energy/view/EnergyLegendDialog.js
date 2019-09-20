// Copyright 2017-2019, University of Colorado Boulder

/**
 * Legend dialog for the energy labels
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const Dialog = require( 'SUN/Dialog' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const energyLegendString = require( 'string!PENDULUM_LAB/energyLegend' );
  const legendKineticEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.kineticEnergyAbbreviation' );
  const legendKineticEnergyString = require( 'string!PENDULUM_LAB/legend.kineticEnergy' );
  const legendPotentialEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.potentialEnergyAbbreviation' );
  const legendPotentialEnergyString = require( 'string!PENDULUM_LAB/legend.potentialEnergy' );
  const legendThermalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.thermalEnergyAbbreviation' );
  const legendThermalEnergyString = require( 'string!PENDULUM_LAB/legend.thermalEnergy' );
  const legendTotalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.totalEnergyAbbreviation' );
  const legendTotalEnergyString = require( 'string!PENDULUM_LAB/legend.totalEnergy' );

  /**
   * @constructor
   */
  function EnergyLegendDialog() {
    const abbreviationGroup = new AlignGroup();
    const descriptionGroup = new AlignGroup();

    const content = new VBox( {
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
        }
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
      ySpacing: 20,
      title: new Text( energyLegendString, {
        font: PendulumLabConstants.DIALOG_TITLE_FONT,
        maxWidth: 700
      } )
    } );
  }

  pendulumLab.register( 'EnergyLegendDialog', EnergyLegendDialog );

  return inherit( Dialog, EnergyLegendDialog );
} );
