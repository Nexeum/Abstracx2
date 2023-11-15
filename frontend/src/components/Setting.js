import React from 'react'
import { Card, Table, Select, Button, TextInput } from 'flowbite-react';

export const Setting = () => {
    return (
        <>
            <Card>
                <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white p-4 text-center">
                    Account Settings
                </h5>
                <Table>
                    <Table.Body>
                        <Table.Row className="bg-white dark:bg-gray-800">
                            <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Multiple Login
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4">
                                <Select id="countries" required>
                                    <option>Not Allowed</option>
                                    <option>Allowed</option>
                                </Select>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:bg-gray-800">
                            <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Registration Mode
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4">
                                <Select id="countries" required>
                                    <option>Authorization not required</option>
                                    <option>Authorization required</option>
                                </Select>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Button className="w-full mt-4">Save</Button>
            </Card>
            <Card>
                <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white p-4 text-center">
                    Contest Settings
                </h5>
                <Table>
                    <Table.Body>
                        <Table.Row className="bg-white dark:bg-gray-800">
                            <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Contest Mode
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4">
                                <Select id="countries" required>
                                    <option>Lockdown</option>
                                    <option>Disabled</option>
                                    <option>Passive</option>
                                    <option>Active</option>
                                </Select>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:bg-gray-800">
                            <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Set Contest End Time
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4">
                                <TextInput id="small" type="text" sizing="sm" placeholder="Enter Number of Minutes from Now" />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:bg-gray-800">
                            <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Set Inccorrect Submission Penalty
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4">
                                <TextInput id="small" type="text" sizing="sm" placeholder="Enter Penalty in Minutes" />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:bg-gray-800">
                            <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Set Ajax Refresh Rate
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4">
                                <TextInput id="small" type="text" sizing="sm" placeholder="Enter Refresh Rate in Seconds" />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Button className="w-full mt-4">Save</Button>
            </Card>
        </>

    )
}