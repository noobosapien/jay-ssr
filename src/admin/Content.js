import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AllProducts from './AllProducts';
import AllOrders from './AllOrders';
import AllUsers from './AllUsers';

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

const tabs = ["All orders", "All users", "All products"];

function Content(props) {
  const { classes, tab } = props;
  var cat = "";
  tabs.includes(tab, 0) ? cat = tab : cat = tabs[0];

  switch(cat){

    case tabs[0]:
      return <AllOrders />;
    case tabs[1]:
      return <AllUsers />;
    case tabs[2]:
      return <AllProducts />;
    default:
      return <></>
  
  }

}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
