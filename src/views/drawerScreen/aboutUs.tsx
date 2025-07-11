import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'

const AboutUs = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>About Us</Text>
                </TouchableOpacity>
                    <ScrollView>
                        <View style={{ padding: 25 }}>
                            <Text style={style.abouttext}>KIDS’ CEREBRAL ACADEMY (KCA) has truly revolutionized the landscape of education with its unique concept of self-education, serving as a powerful supplement to traditional schooling. Led by Dr. Gurupreet Kaur Saluja, a distinguished Child Psychologist,a brainchild of KCA.</Text>
                            <Text style={style.abouttext}>KCA has garnered a national reputation over the span of thirteen years speaks volumes about its effectiveness and the positive impact it has had on students' lives. It's evident that there's a growing recognition of the importance of holistic education, which encompasses not only academic learning but also the development of physical, Cerebral, cognitive, and emotional skills.</Text>
                            <Text style={style.abouttext}>A hallmark of KCA's approach is its provision of scholarships in National drawing and painting competitions, spanning from Nursery to class 10th. It is the only academy offering scholarships in NATIONAL TALENT SEARCH DRAWING & PAINTING A SCHOLARSHIP COMPETITION and has built a national reputation since thirteen years. This initiative not only fosters artistic expression but also cultivates a spirit of creativity and self-discovery among young learners, setting the stage for future academic and personal achievements.</Text>
                            <Text style={style.abouttext}>The mega contest organized by KCA serves as a testament to its commitment to promoting extracurricular engagement and holistic development. With participation from lakhs of students across the nation, this contest offers a platform for children aged 3 to 15 to showcase their talents and skills, thereby encouraging them to pursue excellence and face future challenges with confidence.</Text>
                            <Text style={style.abouttext}>Dr. Gurupreet Kaur's vision for a NATIONAL TALENT SEARCH DRAWING & PAINTING A SCHOLARSHIP COMPETITION, reflects her dedication to fostering all-round development in young learners. Through her research on the psychological aspects of child growth, she endeavors to inspire students to pursue their goals and aspirations, preparing them to navigate the complexities of the 21st century.</Text>
                            <Text style={style.abouttext}>In recognition of participants' achievements, KCA offers a range of attractive prizes and scholarship grants, underscoring its commitment to rewarding excellence and motivating students to strive for success. Additionally, schools that actively encourage student participation are honored, along with the dedicated principals and art teachers who play a pivotal role in nurturing students' talents and passions.</Text>
                            <Text style={style.abouttext}>At the national level, consolation rewards are provided to deserving participants, ensuring that every child receives recognition for their efforts and contributions. This inclusive approach reflects KCA's belief in the importance of celebrating individual achievements and fostering a supportive and encouraging learning environment.</Text>
                        </View>
                    </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default AboutUs