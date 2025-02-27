/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import mocks from '../../../__mocks__/mock-server.json';
import Starred from '../../../components/User/AboutModules/Starred';

describe('Starred', () => {
  let mergedOrgs = mocks.organizations.map((org) => {
    let currentGithubOrg;
    for (const githubOrganization of mocks.githubOrganizations) {
      if (org.id === githubOrganization.id) {
        currentGithubOrg = githubOrganization;
      }
    }
    return { ...org, ...currentGithubOrg, starred: true };
  });

  const test = (mergedOrgs) => {
    it('should render Starred card', async () => {
      // ARRANGE
      render(<Starred starredOrganizations={mergedOrgs} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(mergedOrgs.length);

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };
  test(mergedOrgs);
});
