import * as React from 'react';
import { NavLink, Route, RouteComponentProps, Switch, Link } from 'react-router-dom';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import tw, { theme } from 'twin.macro';
import { faCogs, faLayerGroup, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components/macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { useState } from 'react';

const Navigation = styled.div`
    ${tw`h-full flex-none bg-gradient-to-b from-yellow-400 to-yellow-500 w-16 md:w-16 lg:w-20 flex flex-col justify-between`};

    a {
        ${tw`no-underline text-neutral-900 text-2xl py-6 mx-auto cursor-pointer transition-all duration-150 text-center h-12 md:h-16 lg:h-20`};
    }


`;

export default ({ location }: RouteComponentProps) => {
	const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };
	
	return (
        <div css={tw`flex h-full`}>
          <Navigation>
            <div css={tw`flex flex-col`}>
              <NavLink to={'/'} exact>
                  <FontAwesomeIcon icon={faLayerGroup}/>
              </NavLink>
              <NavLink to={'/account'}>
                  <FontAwesomeIcon icon={faUserCircle}/>
              </NavLink>
            </div>
                    <a onClick={onTriggerLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </a>
          </Navigation>
          <div css={tw`flex-grow`}>
          <NavigationBar/>
          {location.pathname.startsWith('/account') &&
          <SubNavigation>
              <div>
                  <NavLink to={'/account'} exact>Settings</NavLink>
                  <NavLink to={'/account/api'}>API Credentials</NavLink>
              </div>
          </SubNavigation>
          }
          <TransitionRouter>
              <Switch location={location}>
                  <Route path={'/'} exact>
                      <DashboardContainer/>
                  </Route>
                  <Route path={'/account'} exact>
                      <AccountOverviewContainer/>
                  </Route>
                  <Route path={'/account/api'} exact>
                      <AccountApiContainer/>
                  </Route>
                  <Route path={'*'}>
                      <NotFound/>
                  </Route>
              </Switch>
          </TransitionRouter>
          </div>
        </div>
	);
};
