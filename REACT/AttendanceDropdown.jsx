import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import * as attendanceService from '../../services/attendanceService';
import debug from 'sabio-debug';
import toastr from '../../utils/toastr.js';
import NavCard from '../host/NavCard';

const _logger = debug.extend('Attendance');

const AttendanceDropdown = () => {
    const [show, setShow] = useState(false);

    const [pageData, setPageData] = useState({
        attendance: [],
        attendanceComponents: [],
        user: [],
        userComponents: [],
    });

    const handleShow = (a) => {
        setShow(true);
        let menuId = parseInt(a.target.name);

        attendanceService.getSingleWorkShop(0, 10, menuId).then(getSingleWorkShopsSuccess).then(getWorkShopsError);
        _logger(menuId);
    };

    const handleOnChange = (e) => {
        let updateUser = null;
        let curUser = parseInt(e.currentTarget.dataset.user);
        setPageData((prevState) => {
            const pd = { ...prevState };
            const newUsers = [...pd.user];

            for (let index = 0; index < newUsers.length; index++) {
                const element = newUsers[index];
                if (curUser === element.id) {
                    newUsers[index] = { ...element, isPresent: !element.isPresent };
                    updateUser = newUsers[index];
                }
            }

            pd.userComponents = newUsers.map(mapUserItems);
            pd.user = newUsers;

            attendanceService.update(updateUser).then(updateSuccessful);
            return pd;
        });
    };

    function updateSuccessful(user) {
        toastr.success(`${user.firstName} ${user.lastName} is marked present`);
    }

    const getSingleWorkShopsSuccess = (resp) => {
        _logger('we ova here now', resp);
        let user = resp.item.pagedItems;
        _logger(user);

        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.user = user;
            pd.userComponents = user.map(mapUserItems);

            return pd;
        });
    };

    useEffect(() => {
        attendanceService.getCurrentWorkshops(0, 10).then(getCurrentWorkshopsSuccess).catch(getWorkShopsError);
    }, []);

    const getCurrentWorkshopsSuccess = (response) => {
        let attendance = response.data.item.pagedItems;

        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.attendance = attendance;
            pd.attendanceComponents = attendance.map(mapDropItems);
            return pd;
        });
    };

    const getWorkShopsError = (response) => {
        _logger({ getAllError: response });
    };

    const mapDropItems = (item) => {
        return (
            <Dropdown.Item href="#" name={item.sessionId} key={parseInt(item.id)} onClick={handleShow}>
                {item.name + ' ' + item.sessionId}
            </Dropdown.Item>
        );
    };

    const mapUserItems = (user) => {
        return (
            <React.Fragment key={parseInt(user.id)}>
                <span className="account-user-avatar">
                    <img src={user.avatarUrl} width="50px" height="50px" className="rounded-circle" alt="user" />
                </span>
                <p>{user.firstName + ' ' + user.lastName}</p>
                <div className="toggle-switch">
                    <label>
                        <input
                            type="checkbox"
                            onChange={handleOnChange}
                            className="toggle-switch-checkbox"
                            name="toggleSwitch"
                            checked={user.isPresent}
                            data-user={user.id}
                        />
                        Present
                    </label>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <NavCard />
            <Card>
                <Card.Body>
                    <h1 className="header-title">Attendance</h1>
                    <Row>
                        <Col className="col-auto">
                            <DropdownButton variant="light" title="Select By WorkShop">
                                {pageData.attendanceComponents}
                            </DropdownButton>
                        </Col>
                    </Row>{' '}
                    <Row show={show}>{pageData.userComponents}</Row>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default AttendanceDropdown;
