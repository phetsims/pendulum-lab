// Copyright 2002-2014, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // strings
  var rulerString = require( 'string!PENDULUM_LAB/ruler' );
  var stopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );
  var periodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );

  // constants
  var FONT = new PhetFont( 11 );
  var PANEL_WIDTH = 122;

  /**
   * @param {Property<boolean>} isRulerProperty - property to control visibility of ruler.
   * @param {Property<boolean>} isStopwatchProperty - property to control visibility of stopwatch.
   * @param {Property<boolean>} isPeriodTraceProperty - property to control visibility of period trace tool.
   * @param {Object} [options] for tools control panel node.
   * @constructor
   */
  function ToolsControlPanelNode( isRulerProperty, isStopwatchProperty, isPeriodTraceProperty, options ) {
    this._labels = [
      new Text( rulerString, { font: FONT, pickable: false } ),
      new Text( stopwatchString, { font: FONT, pickable: false } ),
      new Text( periodTraceString, { font: FONT, pickable: false } )
    ];

    PanelPendulumAbstract.call( this,
      new Node( {
        children: [
          // necessary to expand panel
          new HStrut( PANEL_WIDTH ),

          new VerticalCheckBoxGroup( [ {
            content: this._labels[ 0 ],
            property: isRulerProperty
          }, {
            content: this._labels[ 1 ],
            property: isStopwatchProperty
          }, {
            content: this._labels[ 2 ],
            property: isPeriodTraceProperty
          }
          ], { spacing: 5, boxWidth: 15 } )
        ]
      } ), options );
  }

  return inherit( PanelPendulumAbstract, ToolsControlPanelNode, {
    /**
     * Set text of label selected by index.
     *
     * @param {number} index - Index of label.
     * @param {string} text - New text for label.
     */
    setLabelText: function( index, text ) {
      this._labels[ index ].setText( text );
    }
  } );
} );