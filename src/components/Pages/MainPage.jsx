import React, { useEffect, useState } from 'react';
import ProjectCards from '../Cards/ProjectCards';
import './mainpage.css';
import Dashboard from './Dashboard';
import { FiSun, FiMoon } from 'react-icons/fi';

const MainPage = (props) => {
	const { category, routes,theme,toggleTheme } = props;
	if (category === '') return <Dashboard theme={theme} toggleTheme={toggleTheme}/>;

	const [projectsData, setProjectsData] = useState([]);
	const [tag, setTag] = useState('All');

	const getName = (category) => {
		let filtered = routes.filter(obj => obj.path === `/${category}`);
		return filtered[0].name;
	}
	const getTech = (category) => {
		let filtered = routes.filter(obj => obj.path === `/${category}`);
		return filtered[0].tech;
	}

	useEffect(() => {
		const fetchData = async () => {
			props.setProgress(10);
			try {
				const response = await fetch(`https://raw.githubusercontent.com/Avdhesh-Varshney/WebMasterLog/main/database/${category}.json`);
				if (!response.ok) {
					throw new Error('Failed to fetch projects data');
				}
				props.setProgress(30);
				const data = await response.json();
				props.setProgress(50);
				let filteredData = data;
				if (tag !== 'All') {
					filteredData = data.filter(project => project.tag === tag);
				}
				props.setProgress(80);
				setProjectsData(filteredData);
			} catch (error) {
				console.error('Error fetching projects data:', error);
			}
			props.setProgress(100);
		};
		fetchData();
	}, [tag]);

	const handleTagClick = (selectedTag) => {
		setTag(selectedTag);
	};

	return (
		<>
		   <div className='container'>
		    <div className="row align-items-center">
                  <div className="col">
				  <h1 className={`project_title ${theme} text-end my-2 mx-3`}>{`${getName(category)} Projects`}</h1>
                  </div>
                  <div className="col-auto theme" onClick={toggleTheme}>
                    <div>
                      {theme === 'light' ? (
                        <FiMoon style={{ color: 'black', fontSize: '28px' }} />
                      ) : (
                        <FiSun style={{ color: 'yellow', fontSize: '28px' }} />
                      )}
                    </div>
                  </div>
                </div>
				</div>
			{/* <h1 className={`project_title ${theme} text-end my-2 mx-3`}>{`${getName(category)} Projects`}</h1> */}
			<div className="d-flex justify-content-end my-2 mx-3">
				<button type="button" className={`btn btn${tag !== 'Basic'? '-outline': ''}-success mx-1`} onClick={() => handleTagClick('Basic')}>Easy</button>
				<button type="button" className={`btn btn${tag !== 'Intermediate'? '-outline': ''}-warning mx-1`} onClick={() => handleTagClick('Intermediate')}>Medium</button>
				<button type="button" className={`btn btn${tag !== 'Advanced'? '-outline': ''}-danger mx-1`} onClick={() => handleTagClick('Advanced')}>Hard</button>
				<button type="button" className={`btn btn${tag !== 'All'? '-outline': ''}-info mx-1`} onClick={() => handleTagClick('All')}>All</button>
			</div>

			<ProjectCards projectsData={projectsData} theme={theme} tech={getTech(category)} />
		</>
	);
}

export default MainPage;
