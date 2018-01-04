/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_COURSE = 'SET_COURSE';
export const SET_EXPANDED_COURSE = 'SET_EXPANDED_COURSE';
export const SET_VIEW = 'SET_VIEW';

/*
 * action creators
 */

export function toggleSideBar() {
	return { type: TOGGLE_SIDEBAR };
}

export function setCourse(courseStr) {
	const [ subject, catalogNumber ] = courseStr.split(' ');

	return {
		type: SET_COURSE,
		course: {
			subject,
			catalogNumber
		}
	};
}

export function setExpandedCourse(courseObj, index) {
	const {
		instructor,
		enrollment_total,
		enrollment_capacity,
		class_number
	} = courseObj;

	return {
		type: SET_EXPANDED_COURSE,
		index,
		instructor,
		attending: String(enrollment_total),
		enrollmentCap: String(enrollment_capacity),
		classNumber: String(class_number)
	};
}

export function setView(view) {
	return { type: SET_VIEW, view };
}