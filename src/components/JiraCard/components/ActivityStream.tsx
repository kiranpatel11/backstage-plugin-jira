/*
 * Copyright 2020 RoadieHQ
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useCallback } from 'react';
import { Box, Divider, Link, Paper, Typography, Tooltip, makeStyles, createStyles, Theme, } from '@material-ui/core';
import { Progress } from '@backstage/core';
import parse, { domToReact, attributesToProps, DomElement } from 'html-react-parser';
import { useActivityStream } from '../../useRequests';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      backgroundColor: '#f6f8fa',
      color: 'rgba(0, 0, 0, 0.87)',
      marginTop: theme.spacing(1),
      overflowY: 'auto',
      maxHeight: '290px',
      '& a': {
        color: theme.palette.primary.main,
      },
      '& hr': {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        margin: theme.spacing(1, 0),
      },
      '& blockquote': {
        background: "#e0f0ff",
        borderLeft: "1px solid #c2d9ef",
        color: "#222",
        fontStyle: "normal",
        margin: theme.spacing(1, 0),
        overflowX: "auto",
        overflowY: "hidden",
        padding: theme.spacing(0, 1),
      },
      '& > :last-child > hr': {
        display: 'none',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#F5F5F5',
        borderRadius: '5px',
      },
      '&::-webkit-scrollbar': {
        width: '5px',
        backgroundColor: '#F5F5F5',
        borderRadius: '5px',
      },
      '&::-webkit-scrollbar-thumb': {
        border: '1px solid #555555',
        backgroundColor: '#555',
        borderRadius: '4px',
      },
      '& span': {
        fontSize: '0.7rem',
      }
    },
    time: {
      lineHeight: 0,
      marginLeft: theme.spacing(1),
    },
    link: {
      cursor: 'pointer',
    }
  }),
);

const options = {
  replace: (node: DomElement) => {
    if (!node) return null;
 
    if (node.name === 'a') { // Add target blank to all a hrefs
      const props = attributesToProps(node.attribs);
      return <a {...props} target="_blank" rel="noopener noreferrer">{domToReact(node.children, options)}</a>;
    }
    return null;
  }
};

export const ActivityStream = () => {
  const classes = useStyles();
  const { activities, activitesLoading, activitiesError } = useActivityStream();

  const showMore = useCallback((e) => {
    e.preventDefault();
  }, []);
  if(activitiesError) return null; // Remove activity stream on error

  return (
    <>
      <Typography variant="subtitle1">Activity stream</Typography>
      <Paper className={classes.paper}>
      { activitesLoading ? <Progress /> : null }
      { activities ? (
        <>
        {activities.map(entry => (
          <Box key={entry.id}>
            {parse(entry.title, options)} 
            <Box>
              {parse((entry.summary || entry.content || ''), options)}
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <Tooltip title={entry.icon.title}>
                <img src={entry.icon.url} alt={entry.icon.title} />
              </Tooltip>
              <Tooltip title={entry.time.value}>
                <Typography variant="caption" className={classes.time}>
                    {entry.time.elapsed}
                </Typography>
              </Tooltip>
            </Box>
            <Divider />
          </Box>
        ))}
        <Box display="flex" justifyContent="center" pt={1}>
          <Link onClick={showMore} className={classes.link}>Show more..</Link>
        </Box>
        </>
      ) : null }
      </Paper>
    </>
  );
 }